import { IShift } from "./shift.interface";
import { IsNotEmpty, IsArray, NotEquals } from "class-validator";

export class ShiftModel implements IShift{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @NotEquals(0)
    nUser: number;
    users: string[];

    constructor(data: Partial<IShift>){
        this.name = data.name || '';
        this.description = data.description || '';
        this.nUser = data.nUser || 0;
        this.users = data.users || [];
    }
}