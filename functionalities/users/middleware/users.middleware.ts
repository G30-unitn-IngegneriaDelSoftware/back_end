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
        
        console.log(user)
        if(user)
            next();
        else
            res.status(404).send(`The user ${req.body.id} does not exists`);
    }

    async validateLoginData(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        if(req.body.username && req.body.password)
            next();
        else
            res.status(400).send("Username or password missing");
    }

    async validateUserSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const sessionId = req.cookies.session;
        
        if(sessionId)
            next();
        else
            res.status(401).send('Unauthorized access');
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