import express from 'express'

import apartmentService from '../services/apartment.service'
import { ApartmentModel } from '../models/apartment.model';
import { validate } from 'class-validator';

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

        if(apartment)
            next();
        else
            res.status(404).send(`Apartment ${req.body.id} not found`);
    }

    async extractApartmentId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        req.body.id = req.params.id;
        next();
    }
}

export default new ApartmentsMiddleware();