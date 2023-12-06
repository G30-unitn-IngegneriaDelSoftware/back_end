import express from 'express'

import MessagesModel from '../model/bulletin.model'
import messagesDao from '../dao/bulletin.dao'
import { validate } from 'class-validator';

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
}

export default new MessagesMiddleware();