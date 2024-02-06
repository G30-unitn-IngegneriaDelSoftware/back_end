import { CRUD } from "../../common/interfaces/crud.interface";
import expensesDao from "../dao/expenses.dao";

class ExpensesService implements CRUD{
    async list(limit: number, page: number){
        return expensesDao.getExpenses(limit, page);
    }

    async readById(id: string){
        return expensesDao.getExpenseById(id);
    }

    async create(resource: any){
        return expensesDao.addExpense(resource);
    }

    async putById(id: string, resource: any): Promise<any>{
        return expensesDao.updateExpenseById(id, resource);
    }

    async patchById(id: string, resource: any): Promise<any> {
        return expensesDao.updateExpenseById(id, resource);
    }

    async deleteById(id: string){
        return expensesDao.removeExpenseById(id);
    }    
}

export default new ExpensesService();