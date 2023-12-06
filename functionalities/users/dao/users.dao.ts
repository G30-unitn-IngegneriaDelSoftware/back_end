import shortid from 'shortid';

import mongooseService from "../../common/services/mongoose.service";
import { UserModel } from "../models/user.model";
import { IUser } from '../models/user.interface';

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    //Schema definition for users
    userSchema = new this.Schema({
        _id: String,
        email: String,
        password: { type: String, select: false },
        username: String,
        firstName: String,
        lastName: String,
        birthDate: Date,
        telephone: String,
    }, {id: false});

    User = mongooseService.getMongoose().model('users', this.userSchema);

    getSchema(){
        return this.User;
    }

    //GET requests
    async getUsers(limit = 25, page = 0){
        return this.User.find()
            .limit(limit)
            .skip(limit*page)
            .exec();
    }


    async getUserByid(userId: string){
        return this.User.findOne({_id: userId}).exec();
    }

    //POST requests
    async addUser(userFields: IUser){
        const userId = shortid.generate();

        const user = new this.User({
            _id: userId,
            ...userFields
        });
        await user.save();
        return userId;
    }

    //PUT requests
    //PATCH request
    async updateUserById(userId: string, userFields: IUser | Partial<IUser>){
        this.User.findOneAndUpdate(
            {_id: userId },
            {$set: userFields },
            {new: true }
        ).exec();
    }

    //DELETE requests
    async removeById(userId: string){
        this.User.deleteOne({_id: userId}).exec();
    }
}

export default new UsersDao();