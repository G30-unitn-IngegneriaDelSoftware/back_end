import { IsNotEmpty } from "class-validator";
import { IUser } from "./user.interface";

export class UserModel implements IUser{
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    telephone: string;
    @IsNotEmpty()
    birthDate: Date | null;
    @IsNotEmpty()
    password: string;

    constructor(data: Partial<IUser>){
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.username = data.username || '';
        this.email = data.email || '';
        this.telephone = data.telephone || '';
        this.birthDate = data.birthDate || null;
        this.password = data.password || '';
    }
}