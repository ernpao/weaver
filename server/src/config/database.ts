import mongoose from 'mongoose';

require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI ?? "");

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err: any) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected.');
        });

    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure if initial connection fails
        // process.exit(1);
    }
};

module.exports = connectDB;