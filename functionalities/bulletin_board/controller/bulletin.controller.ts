import express from 'express'

import messagesService from "../services/bulletin.service"
import apartmentService from '../../apartments/services/apartment.service';

class MessagesController {
    async getMessages(req: express.Request, res: express.Response){
        const messages = await messagesService.list(100, 0);
        res.status(200).send(messages);
    }

    async getMessageById(req: express.Request, res: express.Response){
        const message = await messagesService.readById(req.body.id);
        res.status(200).send(message);
    }

    async postMessage(req: express.Request, res: express.Response){
        const messageId = await messagesService.create(req.body);
        res.status(201).send(messageId);
    }

    async postApartmentMessage(req: express.Request, res: express.Response){
        const messageId = await messagesService.create(req.body);

        const apartment = await apartmentService.readById(req.body.apartmentId);

        if(apartment){
            const messagesIDs = apartment.messages;

            apartmentService.patchById(req.body.apartmentId, {messages: [...messagesIDs, messageId]});
        }

        res.status(201).send(messageId);
    }

    async putById(req: express.Request, res: express.Response){
        await messagesService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async patchById(req: express.Request, res: express.Response){
        await messagesService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async deleteMessage(req: express.Request, res: express.Response){
        await messagesService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export default new MessagesController();