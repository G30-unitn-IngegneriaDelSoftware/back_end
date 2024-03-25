import express from 'express'
import { validate } from 'class-validator';
import { UserModel } from '../models/user.model';
import usersService from '../services/users.service';
import sessionsDao from '../dao/sessions.dao';

class UsersMiddleware {
    async validateBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userBody: UserModel = new UserModel(req.body);

        validate(userBody).then(errors => {
            if(errors.length > 0)
                res.status(400).send({message: "The format of the user is not correct"});
            else{
                next();
            }
        })  
    }

    async validateUsernameDoesntExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const userBody: UserModel = new UserModel(req.body);
        const username = userBody.username;
        const user = await usersService.readByUsername(username);

        if(user)
            res.status(409).send({message: "Username already in use"});
        else
            next(); 
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
            res.status(404).send({message: `The user ${req.body.id} does not exists`});
    }

    async validateLoginData(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        if(req.body.username && req.body.password)
            next();
        else
            res.status(400).send({message: "Username or password missing"});
    }

    async validateLogoutData(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        if(req.body.username)
            next();
        else
            res.status(400).send({message: "Username missing"});
    }

    async validateUserSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const userSessionId = req.cookies.session;
        
        if(userSessionId){
            const sessionId = await sessionsDao.getUserSession(userSessionId);
            
            if(sessionId)
                next();
            else
                res.status(401).send({message: 'Unauthorized access'});
        }else
            res.status(401).send({message: 'Unauthorized access'});
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