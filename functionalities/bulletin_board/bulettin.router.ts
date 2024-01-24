import express from 'express'

import messagesController from './controller/bulletin.controller'
import messagesMiddleware from './middleware/bulletin.middleware'
import { CommonRoutesConfig } from '../common/common.routes.config'
import apartmentsMiddleware from '../apartments/middleware/apartments.middleware';
import apartmentsController from '../apartments/controllers/apartments.controller';

export class MessagesRoutes extends CommonRoutesConfig{
    constructor(app: express.Application){
        super(app, "Messages Router");
    }

    configureRoutes() {
        this.app.route('/messages')
                .get(messagesController.getMessages)
                .post(messagesMiddleware.validateMessageBody,
                    messagesController.postMessage);

        this.app.param('messageId', messagesMiddleware.extractMessageId);

        this.app.route('/messages/:messageId')
                    .all(messagesMiddleware.validateMessageId)
                    .get(messagesController.getMessageById)
                    .delete(messagesController.deleteMessage);

        this.app.put('/messages/:messageId',
                    [
                        messagesMiddleware.validateMessageBody,
                        messagesController.putById
                    ]);

        this.app.patch('/messages/:messageId', messagesController.patchById);

        this.app.param('apartmentId', messagesMiddleware.extractApartmentId);
        this.app.route('/apartments/messages/:apartmentId')
                .all(apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentMessages)
                .post(
                    messagesMiddleware.validateMessageBody,
                    messagesMiddleware.validateMessageAuthor,
                    messagesController.postApartmentMessage);

        return this.app;
    }
}