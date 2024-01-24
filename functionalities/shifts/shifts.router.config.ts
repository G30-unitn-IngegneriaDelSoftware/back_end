import express from 'express'

import { CommonRoutesConfig } from '../common/common.routes.config'
import shiftsController from './controllers/shifts.controller';
import shiftsMiddleware from './middleware/shifts.middleware';
import apartmentsMiddleware from '../apartments/middleware/apartments.middleware';
import apartmentsController from '../apartments/controllers/apartments.controller';

export default class ShiftsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application){
        super(app, "Shifts Routes");
    }

    configureRoutes(): express.Application {
        this.app.route("/shifts")
            .get(shiftsController.listShifts)
            .post(shiftsMiddleware.validateShiftRequestBody,
                shiftsController.post);

        this.app.param("shifId", shiftsMiddleware.extractShiftId);

        this.app.route("/shifts/:shiftId")
                .get(shiftsController.readShiftsById)
                .patch(shiftsController.patch)
                .delete(shiftsController.deleteById);

        this.app.put("/shifts/:shiftId",
                [
                    shiftsMiddleware.validateShiftRequestBody,
                    shiftsController.put
                ]);

        this.app.param('apartmentId', shiftsMiddleware.extractApartmentId),
        this.app.route('/apartments/shifts/:apartmentId')
                .all(apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentShifts)
                .post(
                    shiftsMiddleware.validateShiftRequestBody,
                    shiftsMiddleware.validateShiftUsers,
                    shiftsController.postApartmentShift );

        return this.app;
    }
}