import shortid from 'shortid';
import * as crypto from 'crypto';

import mongooseService from "../../common/services/mongoose.service";
import { IUser } from '../models/user.interface';
import sessionsDao from './sessions.dao';
import apartmentsDao from '../../apartments/dao/apartments.dao';
import apartmentService from '../../apartments/services/apartment.service';
import expensesService from '../../expenses/services/expenses.service';
import expensesDao from '../../expenses/dao/expenses.dao';

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    //Schema definition for users
    userSchema = new this.Schema({
        _id: String,
        salt: String,
        email: String,
        password: String,
        username: {type: String, unique: true},
        firstName: String,
        lastName: String,
        birthDate: Date,
        telephone: String
    }, {id: false});

    User = mongooseService.getMongoose().model('users', this.userSchema);

    getSchema(){
        return this.User;
    }

    hashFunction(password: string, salt: string){
        const hash = crypto.createHash("sha256");
        hash.update(password);
        hash.update(salt);
        
        return hash.digest('hex');
    }
    
    //GET requests
    async getUsers(limit = 25, page = 0){
        return await this.User.find()
        .select('-password -salt')
        .limit(limit)
        .skip(limit*page)
        .exec();
    }
    
    
    async getUserByid(userId: string){
        return await this.User.findOne({_id: userId}).select('-password -salt').exec();
    }

    async getUserByUsername(username: string){
        return await this.User.findOne({username: username}).select('-password -salt').exec();
    }
    
    //POST requests
    async addUser(userFields: IUser){
        const userId = shortid.generate();
        const saltCode = shortid.generate();
        
        userFields.password = this.hashFunction(userFields.password, saltCode);
        
        const user = new this.User({
            _id: userId,
            salt: saltCode,
            ...userFields
        });
        await user.save();
        return userId;
    }

    async login(_username: string, _password: string){
        const user = await this.User.findOne({username: _username}).exec();

        if(user && user.salt && user.password){
            const salt = user.salt;
            const password = user.password;
            
            _password = this.hashFunction(_password, salt);

            if(_password === password){
                const sessionId = await sessionsDao.createSession(_username);
                return sessionId;
            }else{
                return -1;
            }
        }
        return -1;
    }
    
    //PUT requests
    //PATCH request
    async updateUserById(userId: string, userFields: IUser | Partial<IUser>){
        await this.User.findOneAndUpdate(
            {_id: userId },
            {$set: userFields },
            {new: true }
        ).exec();
    }

    //DELETE requests
    async removeById(userId: string){
        const user = await this.getUserByid(userId);
        const username = user?.username;

        if(username){
            const apartments = await apartmentsDao.listUserApartments(25, 0, username);

            apartments.map(async (apartment) => {
                if(apartment._id){
                    apartment.expenses.map(async expenseId => {
                        const expense = await expensesService.readById(expenseId);

                        if(expense){
                            //Se l'utente ha pagato la spesa la spesa viene direttamente rimossa
                            if(expense.creditor && expense.creditor === username){
                                await expensesDao.removeExpenseById(expenseId);
                                return;
                            }

                            //Altrimenti solo il riferimento all'utente viene rimosso
                            const debitors = expense.debitors;

                            let debitorIndex = debitors.indexOf(username);

                            if(debitorIndex >= 0){
                                debitors.splice(debitorIndex, 1);
                                await expensesService.patchById(expenseId, { debitors: debitors });
                            }
                        }
                    });

                    const users = apartment.users;

                    let index = users.indexOf(username);
                    users.splice(index, 1);

                    await apartmentService.patchById(apartment._id, {users: users});
                }
            });
        }

        await this.User.deleteOne({_id: userId}).exec();
    }
}

export default new UsersDao();