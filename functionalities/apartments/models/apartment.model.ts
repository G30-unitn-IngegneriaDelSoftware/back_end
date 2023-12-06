import { IApartment } from "./apartment.interface";
import { IsNotEmpty } from "class-validator";

export class ApartmentModel implements IApartment {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    admin: string;
    @IsNotEmpty()
    users: string[];
    @IsNotEmpty()
    expenses: string[];
    @IsNotEmpty()
    shifts: string[];
    @IsNotEmpty()
    todos: string[];
    @IsNotEmpty()
    messages: string[];

    constructor(data: IApartment | Partial<IApartment>){
        this.name = data.name || '';
        this.description = data.description || '';
        this.admin = data.admin || '';
        this.users = data.users || [];
        this.expenses = data.expenses || [];
        this.shifts = data.shifts || [];
        this.todos = data.todos || [];
        this.messages = data.messages || [];
    }
}