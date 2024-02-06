import express from 'express'

import apartmentService from '../services/apartment.service'
import { ApartmentModel } from '../models/apartment.model';
import { validate } from 'class-validator';
import sessionsDao from '../../users/dao/sessions.dao';

class ApartmentsMiddleware{
    async validateApartmentBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        const apartment: ApartmentModel = new ApartmentModel(req.body);

        validate(apartment).then(errors =>{
            if(errors.length > 0)
                res.status(400).send("The format of the apartment is not correct");
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
            res.status(404).send(`Apartment ${req.body.id} not found`);
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
                res.status(401).send("Only the admin can do this action");
            }
        }else
            res.status(404).send(`Apartment ${req.body.id} not found`);
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        console.log(req.params.apartmentId);
        req.body.id = req.params.apartmentId;
        console.log(req.body.id);
        next();
    }

    async extractExpenseId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        console.log(req.params);
        req.body.expenseId = req.params.expenseId;
        next();
    }
}

export default new ApartmentsMiddleware();