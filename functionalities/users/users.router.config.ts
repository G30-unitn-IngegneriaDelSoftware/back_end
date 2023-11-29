import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import usersController from './controllers/users.controller';
import usersMiddleware from './middleware/users.middleware';

export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application){
        super(app, "UsersRoutes");
    }

    configureRoutes(): express.Application {
        this.app.route('/users')
            .get(usersController.listUsers)
            .post(usersController.postUser);

        this.app.param('userId', usersMiddleware.extractUserId);
        this.app.route('/users/:userId')
            .get(usersController.getUserById)
            .delete(usersController.removeUserById);

        this.app.put('/users/:userId', usersController.putUserById);

        this.app.patch('/users/:userId', usersController.patchUserById);

        return this.app;
    }
}

