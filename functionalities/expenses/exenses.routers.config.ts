import express from 'express'

import { CommonRoutesConfig } from '../common/common.routes.config'
import expensesMiddleware from './middleware/expenses.middleware';
import expensesController from './controllers/expenses.controller';
import apartmentsMiddleware from '../apartments/middleware/apartments.middleware';
import apartmentsController from '../apartments/controllers/apartments.controller';

export class ExpensesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application){
        super(app, "Expenses Routes");
    }

    configureRoutes(): express.Application {
        this.app.route('/expenses')
            .get(expensesController.listExpenses)
            .post(
                expensesMiddleware.validateExpenseRequestBody,
                expensesController.postExpense);

        this.app.param('expenseId', expensesMiddleware.extractExpenseId);
        this.app.route('/expenses/:expenseId')
                .get(expensesController.getById)
                .delete(expensesController.removeById);

        this.app.put('/expenses/:expenseId',
            [
                expensesMiddleware.validateExpenseRequestBody,
                expensesController.putExpenseById
            ]
        );

        this.app.patch('/expenses/:expenseId', expensesController.patchExpenseById);

        this.app.param('apartmentId', expensesMiddleware.extractApartmentId);
        this.app.route('/apartments/expenses/:apartmentId')
                .all(apartmentsMiddleware.validateApartmentId)
                .get(apartmentsController.getApartmentExpenses)
                .post(
                    expensesMiddleware.validateExpenseRequestBody,
                    expensesMiddleware.validateCreditorAndDebitors,
                    expensesController.postApartmentExpense);

        return this.app;
    }
}