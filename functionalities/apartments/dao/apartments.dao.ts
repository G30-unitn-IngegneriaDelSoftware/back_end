import mongooseService from "../../common/services/mongoose.service";

import shortid from "shortid";
import { IApartment } from "../models/apartment.interface";

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

    async getApartmentById(apartmentId: string){
        return this.Apartment.find({_id: apartmentId});
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