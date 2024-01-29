import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import usersController from './controllers/users.controller';
import usersMiddleware from './middleware/users.middleware';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application){
        super(app, "UsersRoutes");
    }

    configureRoutes(): express.Application {
        this.app.route("/login")
            .post(
                usersMiddleware.validateLoginData,
                usersController.login
            );

        this.app.route("/logout")
            .post(
                usersMiddleware.validateLogoutData,
                usersController.logout
            );
        
            this.app.route("/register")
            .post(
                usersMiddleware.validateBodyFields,
                usersController.postUser);

        this.app.route('/users')
            .get(
                usersMiddleware.validateUserSession,
                usersController.listUsers);

        this.app.param('userId', usersMiddleware.extractUserId);
        this.app.route('/users/:userId')
            .all(usersMiddleware.validateUserId,
                usersMiddleware.validateUserSession)
            .get(usersController.getUserById)
            .delete(usersController.removeUserById);

        this.app.put('/users/:userId', 
            [
                usersMiddleware.validateBodyFields,
                usersMiddleware.validateUserSession,
                usersController.putUserById
            ]);

        this.app.patch('/users/:userId', usersController.patchUserById);

        return this.app;
    }
}

