import express from 'express'
import shiftsMiddleware from '../middleware/shifts.middleware'
import shiftsDao from '../dao/shifts.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import usersDao from '../../users/dao/users.dao';

class ShiftsServices implements CRUD{
    async list(limit: number, page: number){
        return shiftsDao.getShifts(limit, page); 
    }

    async readById(id: string) {
        return shiftsDao.getShiftById(id);
    }

    async create(resource: any){
        return shiftsDao.addShift(resource);
    }

    async putById(id: string, resource: any): Promise<any>{
        return usersDao.updateUserById(id, resource);
    }    
    
    async patchById(id: string, resource: any): Promise<any>{
        return usersDao.updateUserById(id, resource);
    }

    async deleteById(id: string){
        return usersDao.removeById(id);
    }
}

export default new ShiftsServices();