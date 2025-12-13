import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { connectDB } from '../config/database';

dotenv.config({ quiet: true } as any);

const createAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            // console.log('Admin user already exists');
            return;
        }

        const admin = await User.create({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });

        // console.log('Admin user created successfully');
        // console.log('Username: admin');
        // console.log('Password: password123');
    } catch (error) {
        // console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin();
