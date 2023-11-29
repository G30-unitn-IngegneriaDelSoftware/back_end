import express from 'express'
import { validate } from 'class-validator';
import { UserModel } from '../models/user.model';

class UsersMiddleware {
    async validateBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userBody: UserModel = new UserModel(req.body);

        validate(userBody).then(errors => {
            if(errors.length > 0)
                res.status(400).send("The format of the user is not correct");
            else
                next();
        })  
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();