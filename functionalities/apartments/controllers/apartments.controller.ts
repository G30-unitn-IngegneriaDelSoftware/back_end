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

    //External Inputs
    async getApartmentMessages(req: express.Request, res: express.Response){
        const messages = await apartmentService.getMessages(req.body.id);
        res.status(200).send(messages);
    }

    async getApartmentMembers(req: express.Request, res: express.Response){
        const members = await apartmentService.getMembers(req.body.id);
        res.status(200).send(members);
    }

    async getApartmentShifts(req: express.Request, res: express.Response){
        const shifts = await apartmentService.getShifts(req.body.id);
        res.status(200).send(shifts);
    }

    async getApartmentExpenses(req: express.Request, res: express.Response){
        const expenses = await apartmentService.getExpenses(req.body.id);
        res.status(200).send(expenses);
    }
}

export default new ApartmentsController();