import { CRUD } from "../../common/interfaces/crud.interface";

import apartmentsDao from "../dao/apartments.dao";

class ApartmentsServece implements CRUD {
    async list(limit: number, page: number){
        return apartmentsDao.listApartments(limit, page);
    }

    async readById(id: string){
        return apartmentsDao.getApartmentById(id);
    }

    async create(resource: any){
        return apartmentsDao.postApartment(resource);
    }

    async putById(id: string, resource: any): Promise<any>{
        return apartmentsDao.updateApartmentById(id, resource);
    }

    async patchById(id: string, resource: any): Promise<any>{
        return apartmentsDao.updateApartmentById(id, resource);
    }

    async deleteById(id: string){
        return apartmentsDao.deleteById(id);
    }

    async getMessages(id: string){
        return apartmentsDao.getApartmentMessages(id);
    }
    
    async getMembers(id: string){
        return apartmentsDao.getApartmentMembers(id);
    }

    async getShifts(id: string){
        return apartmentsDao.getApartmentShifts(id);
    }

    async getExpenses(id: string){
        return apartmentsDao.getApartmentExpenses(id);
    }
}

export default new ApartmentsServece();