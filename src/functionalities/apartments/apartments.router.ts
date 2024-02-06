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
                .get(apartmentsController.getUserApartments)
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
            apartmentsMiddleware.validateIsAdmin,
            apartmentsController.put
        ]);

        this.app.patch('/apartments/:apartmentId', 
                    usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateIsAdmin,
                    apartmentsController.patch);

        this.app.route('/apartments/:apartmentId/expenses')
                .all(usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentExpenses)
                .post(apartmentsController.addExpenseToApartment);
        
        this.app.route('/apartments/:apartmentId/expenses/:expenseId')
                .all(usersMiddleware.validateUserSession,
                    apartmentsMiddleware.extractApartmentId,
                    apartmentsMiddleware.extractExpenseId,
                    apartmentsMiddleware.validateApartmentId)
                .delete(apartmentsController.removeExpenseFromApartment);

        this.app.route('/apartments/:apartmentId/debits')
                .all(usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getDebits);

        this.app.route('/apartments/:apartmentId/members')
                .all(usersMiddleware.validateUserSession,
                    apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentMembers)
                .post(apartmentsController.addMemberToApartment)
                .delete(apartmentsController.removeMemberFromApartment);

        return this.app;
    }
}