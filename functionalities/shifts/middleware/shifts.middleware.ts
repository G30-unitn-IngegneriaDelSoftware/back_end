import express from "express";
import { validate } from "class-validator";
import { ShiftModel } from "../model/shift.model";
import apartmentService from "../../apartments/services/apartment.service";

class ShiftsMiddleWare {
    async validateShiftRequestBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const shiftBody: ShiftModel = new ShiftModel(req.body);

        validate(shiftBody).then(errors => {
            if(errors.length > 0)
                res.status(400).send("The format of shift is not correct");
            else
                next();
        });
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.apartmentId = req.params.apartmentId;
        next();
    }

    async validateShiftUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const apartment = await apartmentService.readById(req.body.apartmentId);
        let status: number = -1;
        let message: string | null = null;

        if(apartment){
            const usersIDs = apartment.users;
            let error = false

            if(req.body.nUsers > usersIDs.length){
                status = 400;
                message = `There are too many users for this shifts`;
            }
            
            if(status == -1){   
                let found = true;
                const shiftsUsersIDs = req.body.users; 
                for(let i = 0; i < shiftsUsersIDs; i++){
                    found = false;

                    for(let j = 0; j < usersIDs.length; j++){
                        if(shiftsUsersIDs[i] == usersIDs[j]){
                            found = true;
                            break;
                        }
                    }

                    if(!found){
                        status = 400;
                        message = `Users in the shifts don't correspond whith apartment members`;
                        break;
                    }
                }

                if(found)
                    next();
        }}
        
        if(status = -1){
            status = 404;
            message = `Apartment ${req.body.apartmentId} not found`;
        }

        res.status(status).send(message);
    }

    async extractShiftId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.id = req.params.shiftId;
        next();
    }
}

export default new ShiftsMiddleWare();