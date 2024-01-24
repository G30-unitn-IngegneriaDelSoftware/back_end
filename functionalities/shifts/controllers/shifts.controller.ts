import express from 'express'
import shiftsService from '../services/shifts.service'
import apartmentService from '../../apartments/services/apartment.service';

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

    async postApartmentShift(req: express.Request, res: express.Response){
        const shiftId = await shiftsService.create(req.body);

        const apartment = await apartmentService.readById(req.body.apartmentId);

        if(apartment){
            const shiftIDs = apartment.shifts;

            await apartmentService.patchById(req.body.apartmentId, { shifts: [...shiftIDs, shiftId]});
        }

        res.status(204).send({ _id: shiftId });
    }
}

export default new ShiftsController();