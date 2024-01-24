import express from "express";
import { validate } from "class-validator";
import { ExpenseModel } from "../model/expenses.model";
import apartmentService from "../../apartments/services/apartment.service";

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

    async validateCreditorAndDebitors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const creditorId = req.body.creditor;
        const debitorsIDs = req.body.debitors;
        
        const apartment = await apartmentService.readById(req.body.apartmentId);

        if(apartment){
            const userIDs = apartment.users;

            let found = false;

            userIDs.forEach(user => {
                if(creditorId == user)
                    found = true;
            });

            if(found){
                for(let i = 0; i < debitorsIDs.length; i++){
                    found = false;

                    for(let j = 0; j < userIDs.length; j++){
                        if(debitorsIDs[i] == userIDs[j]){
                            found = true;
                            break;
                        }
                    }

                    if(!found)
                        break;
                }
            }

            if(found)
                next()
            else
                res.status(400).send(`One or more of the users are not inside apartment ${req.body.apartmentId}`);
        }
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.apartmentId = req.params.apartmentId;
        
        next();
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