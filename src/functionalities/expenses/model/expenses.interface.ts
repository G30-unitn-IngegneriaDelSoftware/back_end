export interface IExpense {
    name: string;
    description: string;
    import: Number;
    date: Date;
    creditor: string;
    debitors: string[];
}