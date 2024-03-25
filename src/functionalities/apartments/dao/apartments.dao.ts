import mongooseService from "../../common/services/mongoose.service";

import shortid from "shortid";
import { IApartment } from "../models/apartment.interface";

//External Daos
import expensesDao from "../../expenses/dao/expenses.dao";
import { IExpense } from "../../expenses/model/expenses.interface";
import expensesService from "../../expenses/services/expenses.service";

class ApartmentsDao{
    Shema = mongooseService.getMongoose().Schema;

    apartmentSchema = new this.Shema({
        _id: String,
        name: String,
        description: String,
        admin: String,
        users: [String],
        expenses: [String]
    }, {id: false});

    Apartment = mongooseService.getMongoose().model('apartments', this.apartmentSchema);

    //GET Requests
    async listApartments(limit = 25, page = 0){
        return this.Apartment.find()
                    .limit(limit)
                    .skip(limit * page)
                    .exec();
    }

    async listUserApartments(limit = 25, page = 0, username: string){
        return this.Apartment.find({
                        users: { $elemMatch: { $eq: username}}
                    })
                    .limit(limit)
                    .skip(limit * page)
                    .exec();
    }

    async getApartmentById(id: string){
        return this.Apartment.findOne({_id: id}).exec();
    }

    async getApartmentMembers(id: string){
        const apartment = await this.Apartment.findOne({ _id: id}).exec();

        if(apartment){
            return apartment.users;
        }

        return [];
    }

    async getApartmentExpenses(id: string){
        const apartment = await this.Apartment.findOne({ _id: id}).exec();

        if(apartment){
            const expensesIDs = apartment.expenses;

            const Expenses = expensesDao.getSchema();

            return Expenses.find({ _id: {"$in": expensesIDs } }).exec();
        }
        
        return [];
    }

    //POST Requests
    async postApartment(apartmentFields: IApartment){
        const apartmentId = shortid.generate();
        const apartment = new this.Apartment({
            _id: apartmentId,
            ...apartmentFields
        });

        await apartment.save();
        return apartmentId;
    }

    //PATCH AND PUT
    async updateApartmentById(apartmentId: string, apartmentFields: IApartment | Partial<IApartment>){
        await this.Apartment.findOneAndUpdate(
            {_id: apartmentId},
            {$set: apartmentFields},
            {new: true}
        ).exec();
    }

    async addExpenseToApartment(apartmentId: string, expenseFields: IExpense){
        const expenseId = await expensesService.create(expenseFields);
        await this.Apartment.findOneAndUpdate(
            {_id: apartmentId},
            { $push: {"expenses": expenseId }}
        ).exec();
        return expenseId;
    }

    async addMemberToApartment(apartmentId: string, userId: string){
        await this.Apartment.findOneAndUpdate(
            {_id: apartmentId},
            { $addToSet: {users: userId}},
            { new: true }
        ).exec();
    } 

    //DELETE
    async deleteById(apartmentId: string){
        await this.Apartment.findOneAndDelete({_id: apartmentId});
    }


    async removeMember(id: string, username: string) {
        await this.Apartment.findOneAndUpdate(
            {_id: id },
            { $pull: { users: username }},
            { new: true }
        ).exec();
    }

    async removeExpense(id: string, expenseId: string) {
        await this.Apartment.findOneAndUpdate(
            {_id: id },
            { $pull: { expenses: expenseId }},
            { new: true }
        ).exec();

        await expensesService.deleteById(expenseId);
    }
}

export default new ApartmentsDao();