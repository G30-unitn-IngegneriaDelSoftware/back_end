import express from 'express'

import apartmentService from '../services/apartment.service'
import { ApartmentModel } from '../models/apartment.model';
import { validate } from 'class-validator';
import sessionsDao from '../../users/dao/sessions.dao';
import expensesService from '../../expenses/services/expenses.service';

class ApartmentsMiddleware{
    async validateApartmentBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const apartment: ApartmentModel = new ApartmentModel(req.body);

        validate(apartment).then(errors =>{
            if(errors.length > 0)
                res.status(400).send({message: "The format of the apartment is not correct"});
            else
                next();
        });
    }

    async validateApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const apartment = await apartmentService.readById(req.body.id);
        
        if(apartment){
            next();
        }else
            res.status(404).send({message: `Apartment ${req.body.id} not found`});
    }

    async validateExpenseId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const expense = await expensesService.readById(req.body.expenseId);

        if(expense){
            next();
        }else
            res.status(404).send({message: `Expense ${req.body.expenseId} not found`});
    }

    async validateIsAdmin(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const apartment = await apartmentService.readById(req.body.id);
        const session = req.cookies.session;
        const sessionToken = await sessionsDao.getUserSession(session);

        if(apartment && sessionToken){
            if(sessionToken.userId && apartment.admin === sessionToken.userId){
                next();
            }else{
                res.status(401).send({message: "Only the admin can perform this action"});
            }
        }
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.id = req.params.apartmentId;
        next();
    }

    async extractExpenseId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.expenseId = req.params.expenseId;
        next();
    }
}

export default new ApartmentsMiddleware();