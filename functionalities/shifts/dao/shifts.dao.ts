import shortid from 'shortid';

import mongooseService from "../../common/services/mongoose.service";
import { IShift } from '../model/shift.interface';

class ShiftsDao {
    Schema = mongooseService.getMongoose().Schema;

    //Schema definition for users
    shiftSchema = new this.Schema({
        _id: String,
        name: String,
        description: String,
        nUser: Number,
        users: [String]
    }, {id: false});

    Shift = mongooseService.getMongoose().model('shifts', this.shiftSchema);

    getSchema() {
        return this.Shift;
    }

    //GET requests
    async getShifts(limit = 25, page = 0){
        return this.Shift.find()
            .limit(limit)
            .skip(limit*page)
            .exec();
    }

    async getShiftById(shiftId: string){
        return this.Shift.findOne({_id: shiftId}).exec();
    }

    //POST requests
    async addShift(shiftFields: IShift){
        const shiftId = shortid.generate();

        const shift = new this.Shift({
            _id: shiftId,
            ...shiftFields
        });
        await shift.save();
        return shiftId;
    }

    //PUT requests
    //PATCH request
    async updateShiftById(shiftId: string, shiftFields: IShift | Partial<IShift>){
        this.Shift.findOneAndUpdate(
            {_id: shiftId },
            {$set: shiftFields },
            {new: true }
        ).exec();
    }

    //DELETE requests
    async removeById(shiftId: string){
        this.Shift.deleteOne({_id: shiftId}).exec();
    }
}

export default new ShiftsDao();