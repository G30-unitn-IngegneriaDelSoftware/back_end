import { CRUD } from "../../common/interfaces/crud.interface";

import apartmentsDao from "../dao/apartments.dao";

class ApartmentsServece implements CRUD {
    async list(limit: number, page: number){
        return apartmentsDao.listApartments(limit, page);
    }

    async listUserApartments(limit: number, page: number, username: string){
        return apartmentsDao.listUserApartments(limit, page, username);
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
    
    async getMembers(id: string){
        return apartmentsDao.getApartmentMembers(id);
    }

    async getExpenses(id: string){
        return apartmentsDao.getApartmentExpenses(id);
    }

    async addExpense(id: string, resource: any){
        return apartmentsDao.addExpenseToApartment(id, resource);
    }

    async addMember(id: string, memberId: any){
        return apartmentsDao.addMemberToApartment(id, memberId);
    }
}

export default new ApartmentsServece();