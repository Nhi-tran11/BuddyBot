const request = require('supertest');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./model/User');
const Assignment = require('./model/Assignment');

// backend/server.test.js

// Mock User and Assignment models
jest.mock('./model/User');
jest.mock('./model/Assignment');

// Import the server (refactor server.js to export app for testing)


jest.spyOn(mongoose, 'connect').mockResolvedValue({});

beforeAll(() => {
    // Mock dotenv
    process.env.MONGODB_URI = 'mongodb://mocked-uri';
    process.env.PORT = 4000;
    process.env.API_KEY = 'fake-api-key';
    jest.resetModules();
});


let {app, server} = require('./server'); // server.js should export the app

afterAll(() => {
    jest.clearAllMocks();
    server.close();
});


describe('User endpoints', () => {
    describe('POST /login', () => {
        it('should login successfully with correct credentials', async () => {
            const fakeUser = { username: 'test', password: 'pass', role: 'parent', _id: '123' };
            User.findOne.mockResolvedValue(fakeUser);

            const res = await request(app)
                .post('/login')
                .send({ username: 'test', password: 'pass' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body.user).toMatchObject({ username: 'test', role: 'parent' });
        });

        it('should fail with incorrect password', async () => {
            const fakeUser = { username: 'test', password: 'pass', role: 'parent' };
            User.findOne.mockResolvedValue(fakeUser);

            const res = await request(app)
                .post('/login')
                .send({ username: 'test', password: 'wrong' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Password is incorrect');
        });

        it('should fail if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/login')
                .send({ username: 'nouser', password: 'pass' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('POST /signup', () => {
        it('should create a new user if email and username are unique', async () => {
            User.findOne
                .mockResolvedValueOnce(null) // email check
                .mockResolvedValueOnce(null); // username check
            User.create.mockResolvedValue({ username: 'newuser', email: 'a@b.com' });

            const res = await request(app)
                .post('/signup')
                .send({ username: 'newuser', email: 'a@b.com', password: 'pass' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Your account is created successfully');
            expect(res.body.user).toHaveProperty('username', 'newuser');
        });

        it('should fail if email already exists', async () => {
            User.findOne.mockResolvedValueOnce({ email: 'a@b.com' });

            const res = await request(app)
                .post('/signup')
                .send({ username: 'newuser', email: 'a@b.com', password: 'pass' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Email already in use');
        });

        it('should fail if username already exists', async () => {
            User.findOne
                .mockResolvedValueOnce(null) // email check
                .mockResolvedValueOnce({ username: 'newuser' }); // username check

            const res = await request(app)
                .post('/signup')
                .send({ username: 'newuser', email: 'a@b.com', password: 'pass' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Username already taken');
        });
    });

    describe('POST /signupChild', () => {
        it('should create a child account if username is unique', async () => {
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ username: 'child', role: 'child' });

            const res = await request(app)
                .post('/signupChild')
                .send({ username: 'child', password: 'pass' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Child account created successfully');
            expect(res.body.user).toHaveProperty('role', 'child');
        });

        it('should fail if username is taken', async () => {
            User.findOne.mockResolvedValue({ username: 'child' });

            const res = await request(app)
                .post('/signupChild')
                .send({ username: 'child', password: 'pass' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Username already taken');
        });
    });

    describe('GET /session/current-user', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(app).get('/session/current-user');
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
        });

        it('should return user info if logged in', async () => {
            // Mock login by first posting to /login to set session
            User.findOne.mockResolvedValue({ username: 'parent', password: 'pass', role: 'parent', _id: '123' });

            const agent = request.agent(app);
            await agent
                .post('/login')
                .send({ username: 'parent', password: 'pass' });

            const res = await agent.get('/session/current-user');
            expect(res.statusCode).toBe(200);
            expect(res.body.user).toHaveProperty('username', 'parent');
            expect(res.body.user).toHaveProperty('role', 'parent');
            expect(res.body).toHaveProperty('isLoggedIn', true);
        });
    });
});