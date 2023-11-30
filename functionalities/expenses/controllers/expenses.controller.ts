import express from 'express'

import expensesService from '../services/expenses.service';

class ExpensesController{
    async listExpenses(req: express.Request, res: express.Response){
        const expenses = await expensesService.list(100, 0);
        res.status(200).send(expenses);
    }

    async getById(req: express.Request, res: express.Response){
        const expense = await expensesService.readById(req.body.id);
        res.status(200).send(expense);
    }

    async postExpense(req: express.Request, res: express.Response){
        const expenseID = await expensesService.create(req.body);
        res.status(201).send({ _id: expenseID });
    }

    async putExpenseById(req: express.Request, res: express.Response){
        await expensesService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async patchExpenseById(req: express.Request, res: express.Response){
        await expensesService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async removeById(req: express.Request, res: express.Response){
        await expensesService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export default new ExpensesController();