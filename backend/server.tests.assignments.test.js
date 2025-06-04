const request = require('supertest');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./model/User');
const Assignment = require('./model/Assignment');

let { app, server } = require('./server'); // server.js should export the app

// Mock User and Assignment models
jest.mock('./model/User');
jest.mock('./model/Assignment');

// Mock mongoose connection
jest.spyOn(mongoose, 'connect').mockResolvedValue({});

beforeAll(() => {
    // Mock dotenv
    process.env.MONGODB_URI = 'mongodb://mocked-uri';
    process.env.PORT = 4000;
    process.env.API_KEY = 'fake-api-key';
    jest.resetModules();
});

afterAll(() => {
    jest.clearAllMocks();
    server.close();
});

describe('Assignments API', () => {
    describe('GET /completedAssignments', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(app).get('/completedAssignments');
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 400 if showCompletedAssignments query is missing', async () => {
            // Mock login
            User.findOne.mockResolvedValue({ username: 'parent', password: 'pass', role: 'parent', _id: '123' });
            const agent = request.agent(app);
            await agent
                .post('/login')
                .send({ username: 'parent', password: 'pass' });

            const res = await agent
                .get('/completedAssignments')
                .query({});
            expect(res.statusCode).toBe(400);
            // expect(res.body).toHaveProperty('message');
        });

        it('should return completed assignments for child', async () => {
            // Mock assignments before login to ensure it's set for the route handler
            Assignment.find.mockResolvedValue([
                {
                    _id: 'a1',
                    assignedTo: '456',
                    status: 'completed',
                    dueDate: new Date('2024-06-01T00:00:00Z'),
                    title: 'Math Homework',
                    description: 'Complete exercises 1-10',
                    toObject: function () { return { ...this }; }
                },
                {
                    _id: 'a2',
                    assignedTo: '456',
                    status: 'completed',
                    dueDate: new Date('2024-06-02T00:00:00Z'),
                    title: 'Science Project',
                    description: 'Build a volcano',
                    toObject: function () { return { ...this }; }
                }
            ]);
            // Mock login as child
            User.findOne.mockResolvedValue({ username: 'child', password: 'pass', role: 'child', _id: '456' });
            const agent = request.agent(app);
            loggedIn = await agent
                .post('/login')
                .send({ username: 'child', password: 'pass' });
            // Ensure session is established before making the request
            const res = await agent.get('/completedAssignments?showCompletedAssignments=true');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.assignments)).toBe(true);

        });
        it('should return completed assignments for parent', async () => {
            // Mock assignments before login to ensure it's set for the route handler
            Assignment.find.mockResolvedValue([
                {
                    _id: 'a1',
                    assignedBy: '123',
                    status: 'completed',
                    dueDate: new Date('2024-06-01T00:00:00Z'),
                    title: 'Math Homework',
                    description: 'Complete exercises 1-10',
                    toObject: function () { return { ...this }; }
                },
                {
                    _id: 'a2',
                    assignedBy: '123',
                    status: 'completed',
                    dueDate: new Date('2024-06-02T00:00:00Z'),
                    title: 'Science Project',
                    description: 'Build a volcano',
                    toObject: function () { return { ...this }; }
                }
            ]);
            // Mock login as parent
            User.findOne.mockResolvedValue({ username: 'parent', password: 'pass', role: 'parent', _id: '123' });
            const agent = request.agent(app);
            loggedIn = await agent
                .post('/login')
                .send({ username: 'parent', password: 'pass' });
            // Ensure session is established before making the request
            const res = await agent.get('/completedAssignments?showCompletedAssignments=true');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.assignments)).toBe(true);
        });

    });
    describe('GET /pendingAssignments', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(app).get('/pendingAssignments');
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 400 if showPendingAssignments query is missing', async () => {
            // Mock login
            User.findOne.mockResolvedValue({ username: 'parent', password: 'pass', role: 'parent', _id: '123' });
            const agent = request.agent(app);
            await agent
                .post('/login')
                .send({ username: 'parent', password: 'pass' });

            const res = await agent
                .get('/pendingAssignments')
                .query({});
            expect(res.statusCode).toBe(400);
            // expect(res.body).toHaveProperty('message');
        });

        it('should return pending assignments for child', async () => {
            // Mock assignments before login to ensure it's set for the route handler
            Assignment.find.mockResolvedValue([
                {
                    _id: 'a1',
                    assignedTo: '456',
                    status: 'pending',
                    dueDate: new Date('2024-06-01T00:00:00Z'),
                    title: 'Math Homework',
                    description: 'Complete exercises 1-10',
                    toObject: function () { return { ...this }; }
                },
                {
                    _id: 'a2',
                    assignedTo: '456',
                    status: 'pending',
                    dueDate: new Date('2024-06-02T00:00:00Z'),
                    title: 'Science Project',
                    description: 'Build a volcano',
                    toObject: function () { return { ...this }; }
                }
            ]);
            // Mock login as child
            User.findOne.mockResolvedValue({ username: 'child', password: 'pass', role: 'child', _id: '456' });
            const agent = request.agent(app);
            loggedIn = await agent
                .post('/login')
                .send({ username: 'child', password: 'pass' });
            // Ensure session is established before making the request
            const res = await agent.get('/pendingAssignments?showPendingAssignments=true');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.assignments)).toBe(true);
        });
        it('should return pending assignments for parent', async () => {
            // Mock assignments before login to ensure it's set for the route handler
            Assignment.find.mockResolvedValue([
                {
                    _id: 'a1',
                    assignedBy: '123',
                    status: 'pending',
                    dueDate: new Date('2024-06-01T00:00:00Z'),
                    title: 'Math Homework',
                    description: 'Complete exercises 1-10',
                    toObject: function () { return { ...this }; }
                },
                {
                    _id: 'a2',
                    assignedBy: '123',
                    status: 'pending',
                    dueDate: new Date('2024-06-02T00:00:00Z'),
                    title: 'Science Project',
                    description: 'Build a volcano',
                    toObject: function () { return { ...this }; }
                }
            ]);
            // Mock login as parent
            User.findOne.mockResolvedValue({ username: 'parent', password: 'pass', role: 'parent', _id: '123' });
            const agent = request.agent(app);
            loggedIn = await agent
                .post('/login')
                .send({ username: 'parent', password: 'pass' });
            // Ensure session is established before making the request
            const res = await agent.get('/pendingAssignments?showPendingAssignments=true');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.assignments)).toBe(true);
        });
    });


});
