import mongooseService from "../../common/services/mongoose.service";

import shortid from "shortid";
import { IApartment } from "../models/apartment.interface";

//External Daos
import messagesDao from "../../bulletin_board/dao/bulletin.dao";
import usersDao from "../../users/dao/users.dao";
import shiftsDao from "../../shifts/dao/shifts.dao";
import expensesDao from "../../expenses/dao/expenses.dao";

class ApartmentsDao{
    Shema = mongooseService.getMongoose().Schema;

    apartmentSchema = new this.Shema({
        _id: String,
        name: String,
        description: String,
        admin: String,
        users: [String],
        expenses: [String],
        shifts: [String],
        todos: [String],
        messages: [String]
    }, {id: false});

    Apartment = mongooseService.getMongoose().model('apartments', this.apartmentSchema);

    //GET Requests
    async listApartments(limit = 25, page = 0){
        return this.Apartment.find()
                    .limit(limit)
                    .skip(limit * page)
                    .exec();
    }

    async getApartmentById(id: string){
        return this.Apartment.findOne({_id: id}).exec();
    }

    //GET elements linked to apartment
    async getApartmentMessages(id: string){
        const apartment = await this.Apartment.findOne({ _id: id }).exec();
        
        if(apartment){
            const messagesIDs = apartment.messages;
            
            const Messages = messagesDao.getSchema();

            return Messages.find({ _id: {"$in": messagesIDs }}).exec();
        }

        return [];
    }

    async getApartmentMembers(id: string){
        const apartment = await this.Apartment.findOne({ _id: id}).exec();

        if(apartment){
            const membersIDs = apartment.users;

            const Users = usersDao.getSchema();

            return Users.find({ _id: {"$in": membersIDs } }).exec();
        }

        return [];
    }

    async getApartmentShifts(id: string){
        const apartment = await this.Apartment.findOne({ _id: id}).exec();

        if(apartment){
            const shiftsIDs = apartment.shifts;

            const Shifts = shiftsDao.getSchema();

            return Shifts.find({ _id: {"$in": shiftsIDs } }).exec();
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

        console.log("Empty");
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
        this.Apartment.findOneAndUpdate(
            {_id: apartmentId},
            {$set: apartmentFields},
            {new: true}
        ).exec();
    }

    //DELETE
    async deleteById(apartmentId: string){
        this.Apartment.findOneAndDelete({_id: apartmentId});
    }
}

export default new ApartmentsDao();