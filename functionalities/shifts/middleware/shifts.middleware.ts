import express from "express";
import { validate } from "class-validator";
import { ShiftModel } from "../model/shift.model";

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