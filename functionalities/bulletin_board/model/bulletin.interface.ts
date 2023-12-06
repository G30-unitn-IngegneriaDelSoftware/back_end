export interface IMessage{
    date: Date;
    messageText: String;
    author: String; //Chiave dell'utente che scrive il messaggio
    anonymous: boolean;
    fixed: boolean;
    commentOf: string | null; //commento a un messaggio --> Inserire chiave del messaggio interessato
}