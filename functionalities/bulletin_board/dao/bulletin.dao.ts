import mongooseService from "../../common/services/mongoose.service";
import shortid from "shortid";
import { IMessage } from "../model/bulletin.interface";
import MessagesModel from "../model/bulletin.model";

class MessagesDao {
    Schema = mongooseService.getMongoose().Schema;

    messageSchema = new this.Schema({
        _id: String,
        messageText: String,
        author: String,
        fixed: Boolean,
        anonymous: Boolean,
        date: Date,
        commentOf: String
    }, {id: false});

    Message = mongooseService.getMongoose().model("messages", this.messageSchema)

    async listMessages(limit = 25, page = 0){
        return this.Message.find()
                            .limit(limit)
                            .skip(limit * page)
                            .exec()
    }

    async getMessageById(messageId: string){
        return this.Message.find({_id: messageId}).exec();
    }

    async postMessage(messageFields: IMessage){
        const messageId = shortid.generate();

        const newMessage: MessagesModel = new MessagesModel(messageFields);
        const message = new this.Message({
            _id: messageId,
            ...newMessage
        });

        await message.save();

        return messageId;
    }

    async updateMessageById(messageId: string, messageFields: IMessage | Partial<IMessage>){
        this.Message.findOneAndUpdate(
            {_id: messageId},
            {$set: messageFields},
            {new: true}
        ).exec();
    }

    async deleteById(messageId: string){
        this.Message.findOneAndDelete({ _id: messageId }).exec();
    }
}

export default new MessagesDao();