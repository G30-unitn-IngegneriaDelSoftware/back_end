import express from 'express'
import { validate } from 'class-validator';
import { UserModel } from '../models/user.model';
import usersService from '../services/users.service';

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

    async validateUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const user = await usersService.readById(req.body.id)

        if(user)
            next();
        else
            res.status(404).send(`The user ${req.body.id} does not exists`);
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