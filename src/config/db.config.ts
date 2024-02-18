import mongoose from 'mongoose';
import ErrorResponse from '../utils/error_response';

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, {
            serverSelectionTimeoutMS: 30000
        })
        mongoose.set('bufferCommands', false);
    } catch (error) {
        console.log('DB_ERROR = ', error)

        new ErrorResponse(error.toString(), 500)
    }
}

export default connectDB;