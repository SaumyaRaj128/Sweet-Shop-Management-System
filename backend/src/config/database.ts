import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
