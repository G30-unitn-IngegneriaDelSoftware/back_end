import { Min, IsNotEmpty, ArrayNotEmpty } from "class-validator";
import { IExpense } from "./expenses.interface";

export class ExpenseModel implements IExpense{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    @Min(0.01)
    import: Number;
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    creditor: string;
    @IsNotEmpty()
    @ArrayNotEmpty()
    debitors: string[];

    constructor(data: Partial<IExpense>){
        this.name = data.name || '';
        this.description = data.description || '';
        this.import = data.import || 0;
        this.date = new Date();
        this.creditor = data.creditor || '';
        this.debitors = data.debitors || [];
    }
}