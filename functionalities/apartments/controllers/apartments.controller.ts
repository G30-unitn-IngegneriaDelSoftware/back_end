import express from 'express'

import apartmentService from '../services/apartment.service'

class ApartmentsController{
    async getApartments(req: express.Request, res: express.Response){
        const apartments = await apartmentService.list(100, 0);
        res.status(200).send(apartments);
    }

    async getApartmentById(req: express.Request, res: express.Response){
        const apartment = await apartmentService.readById(req.body.id);
        res.status(200).send(apartment);
    }

    async post(req: express.Request, res: express.Response){
        const apartmentId = await apartmentService.create(req.body);
        res.status(201).send(apartmentId);
    }

    async put(req: express.Request, res: express.Response){
        await apartmentService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async patch(req: express.Request, res: express.Response){
        await apartmentService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async delete(req: express.Request, res: express.Response){
        await apartmentService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export default new ApartmentsController();