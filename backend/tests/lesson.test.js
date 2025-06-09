const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Lesson = require('../model/lesson');

// Setup DB connection
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear lessons after each test
afterEach(async () => {
  await Lesson.deleteMany();
});

// Close DB + server after all tests
afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('POST /api/lessons (TDD)', () => {

 /* // ❌ TEST 1: Written before the backend route exists
  it('should FAIL because no code is written yet', async () => {
    // This is how TDD starts: no backend logic yet
    const res = await request(app)
      .post('/api/lessons')
      .send({
        title: 'TDD Start',
        description: 'No backend code yet',
        subject: 'Math',
        youtubeUrl: 'https://youtube.com/watch?v=nocode'
      });

    expect(res.statusCode).toBe(201); // Fails because the endpoint doesn't work yet
  });

  // ✅ TEST 2: After backend code is added
  it('should PASS with valid lesson input', async () => {
    const res = await request(app)
      .post('/api/lessons')
      .send({
        title: 'Addition Basics',
        description: 'Step-by-step addition',
        subject: 'Mathematics',
        youtubeUrl: 'https://youtube.com/watch?v=abc123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.lesson).toHaveProperty('_id');
    expect(res.body.lesson.title).toBe('Addition Basics');
  });*/

 // ✅ TEST 3: Confirms data saved in DB
  it('should store lesson in the database', async () => {
    await request(app)
      .post('/api/lessons')
      .send({
        title: 'Subtraction Basics',
        description: 'Learn to subtract',
        subject: 'Mathematics',
        youtubeUrl: 'https://youtube.com/watch?v=sub456'
      });

    const lessons = await Lesson.find({});
    expect(lessons.length).toBe(1);
    expect(lessons[0].title).toBe('Subtraction Basics');
    expect(lessons[0].youtubeUrl).toBe('https://youtube.com/watch?v=sub456');
  });

});
