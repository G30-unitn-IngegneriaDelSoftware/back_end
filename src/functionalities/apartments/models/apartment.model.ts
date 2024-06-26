import { IApartment } from "./apartment.interface";
import { IsNotEmpty } from "class-validator";

export class ApartmentModel implements IApartment {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    admin: string;
    users: string[];
    expenses: string[];

    constructor(data: IApartment | Partial<IApartment>){
        this.name = data.name || '';
        this.description = data.description || '';
        this.admin = data.admin || '';
        this.users = data.users || [];
        this.expenses = data.expenses || [];
    }
}