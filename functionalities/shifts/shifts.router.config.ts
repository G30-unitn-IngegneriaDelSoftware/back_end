import express from 'express'

import { CommonRoutesConfig } from '../common/common.routes.config'
import shiftsController from './controllers/shifts.controller';
import shiftsMiddleware from './middleware/shifts.middleware';

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

        return this.app;
    }
}