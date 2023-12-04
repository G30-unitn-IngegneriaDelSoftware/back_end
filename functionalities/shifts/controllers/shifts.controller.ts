import express from 'express'
import shiftsService from '../services/shifts.service'

class ShiftsController{
    async listShifts(req: express.Request, res: express.Response){
        const users = await shiftsService.list(100, 0);
        res.status(200).send(users);
    }

    async readShiftsById(req: express.Request, res: express.Response){
        const user = await shiftsService.readById(req.body.id);
        res.status(200).send(user);
    }

    async post(req: express.Request, res: express.Response){
        const userId = await shiftsService.create(req.body);
        res.status(201).send(userId);
    }

    async put(req: express.Request, res: express.Response){
        await shiftsService.putById(req.body.id, req.body);
        res.status(204).send();
    }


    async patch(req: express.Request, res: express.Response){
        await shiftsService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async deleteById(req: express.Request, res: express.Response){
        await shiftsService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export default new ShiftsController();