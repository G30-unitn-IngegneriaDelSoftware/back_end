import express from "express";
import { validate } from "class-validator";
import { ExpenseModel } from "../model/expenses.model";

class ExpensesMiddleWare {
    async validateExpenseRequestBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const expenseBody: ExpenseModel = new ExpenseModel(req.body);

        validate(expenseBody).then(errors => {
            if(errors.length > 0)
                res.status(400).send("The format of expense is not correct");
            else
                next();
        });
    }

    async extractExpenseId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.id = req.params.expenseId;
        next();
    }
}

export default new ExpensesMiddleWare();