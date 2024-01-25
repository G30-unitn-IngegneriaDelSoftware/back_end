import express from "express";

import apartmentsController from "./controllers/apartments.controller";
import apartmentsMiddleware from "./middleware/apartments.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";

export class ApartmentsRoutes extends CommonRoutesConfig{
    constructor(app: express.Application){
        super(app, "Apartments routes");
    }

    configureRoutes(): express.Application {
        this.app.route('/apartments')
                .get(apartmentsController.getApartments)
                .post(apartmentsMiddleware.validateApartmentBody,
                    apartmentsController.post);

        this.app.param('apartmentId', apartmentsMiddleware.extractApartmentId);
        this.app.route('/apartments/:apartmentId')
                .all(apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentById)
                .delete(apartmentsController.delete);

        this.app.put('/apartments/:apartmentId',[
            apartmentsMiddleware.validateApartmentBody,
            apartmentsController.put
        ]);

        this.app.patch('/apartments/:apartmentId', apartmentsController.patch);

        this.app.route('/apartments/:apartmentId/expenses')
                .get(
                apartmentsMiddleware.validateApartmentId,
                apartmentsController.getApartmentExpenses);

        this.app.route('/apartments/:apartmentId/members')
                .get(
                apartmentsMiddleware.validateApartmentId,
                apartmentsController.getApartmentMembers);
        
        return this.app;
    }
}