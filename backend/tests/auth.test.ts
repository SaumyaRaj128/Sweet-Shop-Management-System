import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import { User } from '../src/models/User';

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop_test');
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123',
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not register a user with an existing username', async () => {
        await User.create({ username: 'testuser', password: 'password123' });

        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'newpassword',
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should not register a user with missing fields', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
        });

        expect(res.status).toBe(400);
    });
});
