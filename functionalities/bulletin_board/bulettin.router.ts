import express from 'express'

import messagesController from './controller/bulletin.controller'
import messagesMiddleware from './middleware/bulletin.middleware'
import { CommonRoutesConfig } from '../common/common.routes.config'

export class MessagesRoutes extends CommonRoutesConfig{
    constructor(app: express.Application){
        super(app, "Messages Router");
    }

    configureRoutes() {
        this.app.route('/messages')
                .get(messagesController.getMessages)
                .post(messagesMiddleware.validateMessageBody,
                    messagesController.postMessage);

        this.app.param(':messageId', messagesMiddleware.extractMessageId);

        this.app.route('/messages/:messageId')
                    .all(messagesMiddleware.validateMessageId)
                    .get(messagesController.getMessageById)
                    .delete(messagesController.deleteMessage);

        this.app.put('/messages/:messageId',
                    [
                        messagesMiddleware.validateMessageBody,
                        messagesController.putById
                    ]);

        this.app.patch('/messages/:messagsId', messagesController.patchById);

        return this.app;
    }
}