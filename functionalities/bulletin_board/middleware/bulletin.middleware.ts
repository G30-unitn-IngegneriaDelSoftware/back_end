import express from 'express'

import MessagesModel from '../model/bulletin.model'
import messagesDao from '../dao/bulletin.dao'
import { validate } from 'class-validator';
import apartmentService from '../../apartments/services/apartment.service';

class MessagesMiddleware {
    async validateMessageBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const messageBody: MessagesModel = new MessagesModel(req.body);

        validate(messageBody).then(errors => {
            if(errors.length > 0)
                res.status(400).send("The format of the message it's not correct");
            else
                next();
        });
    }

    async validateMessageAuthor(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const apartment = await apartmentService.readById(req.body.apartmentId);

        if(apartment){
            const usersIds = apartment.users;
            let found = false;

            usersIds.forEach(userId => {
                if(userId == req.body.author)
                    found = true
            });

            if(found)
                next()
            else
                res.status(400).send(`The users ${req.body.author} is not inside apartment`)
        }

        res.status(400).send(`The apartment ${req.body.apartmentId} has not been found`);
    }

    async validateMessageId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const message = await messagesDao.getMessageById(req.body.id);

        if(message)
            next();
        else
            res.status(404).send(`The message ${req.body.id} does not exists`);
    }

    async extractMessageId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.messageId;
        next();
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.apartmentId = req.params.apartmentId;
        next();
    }
}

export default new MessagesMiddleware();