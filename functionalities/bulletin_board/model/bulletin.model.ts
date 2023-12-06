import { IMessage } from "./bulletin.interface";
import { IsNotEmpty } from "class-validator";

export default class MessagesModel implements IMessage {
    date: Date;
    @IsNotEmpty()
    messageText: String;
    @IsNotEmpty()
    author: String;
    @IsNotEmpty()
    fixed: boolean;
    commentOf: string | null;
    @IsNotEmpty()
    anonymous: boolean;

    constructor(data: IMessage | Partial<IMessage>){
        this.date = new Date();
        this.author = data.author || '';
        this.anonymous = data.anonymous || false;
        this.messageText = data.messageText || '';
        this.commentOf = data.commentOf || null;
        this.fixed = data.fixed || false;
    }    
}