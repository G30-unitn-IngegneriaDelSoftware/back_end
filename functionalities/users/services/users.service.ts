import { CRUD } from "../../common/interfaces/crud.interface";
import usersDao from "../dao/users.dao";

class UsersService implements CRUD{
    async list(limit: number, page: number){
        return usersDao.getUsers(limit, page);
    }

    async readById(id: string){
        return usersDao.getUserByid(id);
    }

    async create(resource: any){
        return usersDao.addUser(resource);
    }

    async putById(id: string, resource: any): Promise<any>{
        return usersDao.updateUserById(id, resource);
    }

    async patchById(id: string, resource: any): Promise<any> {
        return usersDao.updateUserById(id, resource);
    }

    async deleteById(id: string){
        return usersDao.removeById(id);
    }    
}

export default new UsersService();