import express from 'express'

import { CommonRoutesConfig } from '../common/common.routes.config'
import expensesMiddleware from './middleware/expenses.middleware';
import expensesController from './controllers/expenses.controller';
import apartmentsMiddleware from '../apartments/middleware/apartments.middleware';
import apartmentsController from '../apartments/controllers/apartments.controller';
import usersMiddleware from '../users/middleware/users.middleware';

export class ExpensesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application){
        super(app, "Expenses Routes");
    }

    configureRoutes(): express.Application {
        this.app.route('/expenses')
            .all(usersMiddleware.validateUserSession)
            .get(expensesController.listExpenses)

        this.app.param('expenseId', expensesMiddleware.extractExpenseId);
        this.app.route('/expenses/:expenseId')
                .all(usersMiddleware.validateUserSession)
                .get(expensesController.getById)
                .delete(expensesController.removeById);

        this.app.put('/expenses/:expenseId',
            [
                usersMiddleware.validateUserSession,
                expensesMiddleware.validateExpenseRequestBody,
                expensesController.putExpenseById
            ]
        );

        this.app.patch('/expenses/:expenseId', 
                        usersMiddleware.validateUserSession,
                        expensesController.patchExpenseById);

        return this.app;
    }
}