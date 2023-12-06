import { CRUD } from "../../common/interfaces/crud.interface";

import messagesDao from "../dao/bulletin.dao"

class MessagesService implements CRUD{
    async list(limit: number, page: number){
        return messagesDao.listMessages(limit, page);
    }

    async readById(id: string){
        return messagesDao.getMessageById(id);
    }

    async create(resource: any){
        return messagesDao.postMessage(resource);
    }

    async putById(id: string, resource: any): Promise<any>{
        return messagesDao.updateMessageById(id, resource);
    }

    async patchById(id: string, resource: any): Promise<any>{
        return messagesDao.updateMessageById(id, resource);
    }

    async deleteById(id: string){
        return messagesDao.deleteById(id);
    }
}

export default new MessagesService();