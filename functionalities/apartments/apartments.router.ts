import express from "express";

import apartmentsController from "./controllers/apartments.controller";
import apartmentsMiddleware from "./middleware/apartments.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import usersMiddleware from "../users/middleware/users.middleware";

export class ApartmentsRoutes extends CommonRoutesConfig{
    constructor(app: express.Application){
        super(app, "Apartments routes");
    }

    configureRoutes(): express.Application {
        this.app.route('/apartments')
                .all(usersMiddleware.validateUserSession)
                .get(apartmentsController.getApartments)
                .post(apartmentsMiddleware.validateApartmentBody,
                    apartmentsController.post);

        this.app.param('apartmentId', apartmentsMiddleware.extractApartmentId);
        this.app.route('/apartments/:apartmentId')
                .all(
                    usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentById)
                .delete(apartmentsController.delete);

        this.app.put('/apartments/:apartmentId',[
            usersMiddleware.validateUserSession,
            apartmentsMiddleware.validateApartmentBody,
            apartmentsController.put
        ]);

        this.app.patch('/apartments/:apartmentId', 
                    usersMiddleware.validateUserSession,
                    apartmentsController.patch);

        this.app.route('/apartments/:apartmentId/expenses')
                .all(usersMiddleware.validateUserSession)
                .get(
                    apartmentsMiddleware.validateApartmentId,
                    apartmentsController.getApartmentExpenses)
                .post(apartmentsController.addExpenseToApartment);

        this.app.route('/apartments/:apartmentId/debits')
                .get(
                    usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId,
                    apartmentsController.getDebits);

        this.app.route('/apartments/:apartmentId/members')
                .get(
                    usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId,
                    apartmentsController.getApartmentMembers);
        
        //TODO: delete member and expense endpoints
        //TODO: validateApartmentExpenseId middleware function
        //TODO: validateIsAdmin middleware function

        return this.app;
    }
}