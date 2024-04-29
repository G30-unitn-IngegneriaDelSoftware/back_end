import mongoose from 'mongoose';
require('dotenv').config();

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        console.log('Attempting MongoDB connection (will retry if needed)');

        const dbString = (process.env.NODE_ENV === 'test') ? process.env.TEST_DB_STRING : process.env.DB_STRING;

        mongoose
            .connect(dbString || '', this.mongooseOptions)
            .then(() => {
                console.log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();