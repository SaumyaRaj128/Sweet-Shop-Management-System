import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ quiet: true } as any);
import app from '../src/app';
import { Sweet } from '../src/models/Sweet';
import { User } from '../src/models/User';

let token: string;
let adminToken: string;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop_test');
    }

    // Create user and get token
    await User.deleteMany({});
    const userRes = await request(app).post('/api/auth/register').send({
        username: 'normaluser',
        password: 'password123',
    });
    token = userRes.body.token;

    // Create admin and get token
    const admin = await User.create({
        username: 'adminuser',
        password: 'password123',
        role: 'admin'
    });
    // Manually login admin since we can't register as admin directly via public endpoint easily without changing logic or seeding
    const adminLoginRes = await request(app).post('/api/auth/login').send({
        username: 'adminuser',
        password: 'password123',
    });
    adminToken = adminLoginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Sweet.deleteMany({});
});

describe('Sweets Management', () => {
    it('should create a sweet (authenticated)', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Ladoo',
                category: 'Traditional',
                price: 15,
                quantity: 100,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'Ladoo');
    });

    it('should not create a sweet (unauthenticated)', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .send({
                name: 'Ladoo',
                category: 'Traditional',
                price: 15,
                quantity: 100,
            });

        expect(res.status).toBe(401);
    });

    it('should list all sweets', async () => {
        await Sweet.create({ name: 'Ladoo', category: 'Traditional', price: 15, quantity: 100 });
        await Sweet.create({ name: 'Barfi', category: 'Traditional', price: 20, quantity: 50 });

        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should search sweets', async () => {
        await Sweet.create({ name: 'Ladoo', category: 'Traditional', price: 15, quantity: 100 });
        await Sweet.create({ name: 'Chocolate Cake', category: 'Cake', price: 50, quantity: 20 });

        const res = await request(app)
            .get('/api/sweets/search?q=Cake')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Chocolate Cake');
    });

    it('should update a sweet', async () => {
        const sweet = await Sweet.create({ name: 'Ladoo', category: 'Traditional', price: 15, quantity: 100 });

        const res = await request(app)
            .put(`/api/sweets/${sweet.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                price: 18
            });

        expect(res.status).toBe(200);
        expect(res.body.price).toBe(18);
    });

    it('should delete a sweet (admin only)', async () => {
        const sweet = await Sweet.create({ name: 'Ladoo', category: 'Traditional', price: 15, quantity: 100 });

        // Normal user logic - fail
        const resUser = await request(app)
            .delete(`/api/sweets/${sweet.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(resUser.status).toBe(401); // Or 403

        // Admin logic - success
        const resAdmin = await request(app)
            .delete(`/api/sweets/${sweet.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(resAdmin.status).toBe(200);

        const check = await Sweet.findById(sweet.id);
        expect(check).toBeNull();
    });

    it('should purchase a sweet (decrease quantity)', async () => {
        const sweet = await Sweet.create({ name: 'Jalebi', category: 'Traditional', price: 10, quantity: 50 });

        const res = await request(app)
            .post(`/api/sweets/${sweet.id}/purchase`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 5 });

        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(45);
        expect(res.body.message).toBe('Purchase successful');

        const updatedSweet = await Sweet.findById(sweet.id);
        expect(updatedSweet?.quantity).toBe(45);
    });

    it('should not purchase more sweets than available', async () => {
        const sweet = await Sweet.create({ name: 'Jalebi', category: 'Traditional', price: 10, quantity: 5 });

        const res = await request(app)
            .post(`/api/sweets/${sweet.id}/purchase`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 10 });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Not enough stock');
    });

    it('should restock a sweet (admin only)', async () => {
        const sweet = await Sweet.create({ name: 'Rasgulla', category: 'Traditional', price: 20, quantity: 10 });

        // Normal user
        const resUser = await request(app)
            .post(`/api/sweets/${sweet.id}/restock`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 10 });
        expect(resUser.status).toBe(401);

        // Admin
        const resAdmin = await request(app)
            .post(`/api/sweets/${sweet.id}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 10 });

        expect(resAdmin.status).toBe(200);
        expect(resAdmin.body.quantity).toBe(20);

        const updatedSweet = await Sweet.findById(sweet.id);
        expect(updatedSweet?.quantity).toBe(20);
    });
});
