import mongooseService from "../../common/services/mongoose.service";
import shortid from "shortid";

import { IExpense } from "../model/expenses.interface";
import { ExpenseModel } from "../model/expenses.model";

class ExpensesDao {
    Schema = mongooseService.getMongoose().Schema;

    expenseSchema = new this.Schema({
        _id: String,
        name: String,
        description: String,
        import: Number,
        date: Date,
        creditor: String,
        debitors: [String]
    });

    Expense = mongooseService.getMongoose().model('expenses', this.expenseSchema);

    //GET requests
    async getExpenses(limit = 25, page = 0){
        return this.Expense.find()
            .limit(limit)
            .skip(limit*page)
            .exec();
    }

    async getExpenseById(expenseId: string){
        return this.Expense.findOne({ _id: expenseId }).exec();
    }

    //POST requests
    async addExpense(expenseFields: IExpense){
        const expenseId = shortid.generate();
        const expenseBody = new this.Expense({
            _id: expenseId,
            ...expenseFields
        });

        await expenseBody.save();
        return expenseId;
    }

    //PATCH E PUT
    async updateExpenseById(expenseId: String, expenseFields: IExpense | Partial<IExpense>){
        this.Expense.findOneAndUpdate(
            {_id: expenseId},
            {$set: expenseFields},
            {new: true}
        ).exec();
    }

    //DELETE
    async removeExpenseById(expenseId: string){
        this.Expense.findOneAndDelete({_id: expenseId }).exec();
    }
}

export default new ExpensesDao();