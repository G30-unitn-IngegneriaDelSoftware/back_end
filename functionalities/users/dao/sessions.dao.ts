import shortid from 'shortid';

import mongooseService from "../../common/services/mongoose.service";

class SessionDao{
    Schema = mongooseService.getMongoose().Schema;

    sessionSchema = new this.Schema({
        _id: String,
        sessionId: String,
        userId: String,
        expireDate: Date
    }, {id: false});

    Session = mongooseService.getMongoose().model('sessions', this.sessionSchema);

    async getUserSession(userID: string){
        await this.clearExpiredsessions();
        return this.Session.findOne({userId: userID}).exec();
    }

    async createSession(userID: string){
        await this.clearExpiredsessions();
        await this.clearUserSessions(userID);

        const id = shortid.generate();
        const sessionID = shortid.generate();
        const expireTime = (new Date()).getTime() + 60 * 60 * 1000;

        const newSession = new this.Session({
            _id: id,
            sessionId: sessionID,
            userId: userID,
            expireDate: expireTime
        })

        await newSession.save();
        return sessionID;
    }

    async clearUserSessions(_userId: string){
        await this.Session.deleteOne({userId: _userId}).exec();
    }

    async clearExpiredsessions(){
        await this.Session.deleteMany({ expireDate: { $lt: new Date()} }).exec();
    }
}

export default new SessionDao();