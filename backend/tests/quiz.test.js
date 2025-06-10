const request = require('supertest');
const { app, server } = require('../server');
const Quiz = require('../model/quizModel');

jest.mock('../model/quizModel', () => ({
  find: jest.fn()
}));

describe('GET /api/quiz/:subject', () => {
  afterAll(() => server.close());

  test('should return 10 questions for a given subject', async () => {
    const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
      question: `Sample question ${i + 1}`,
      options: ['a', 'b', 'c', 'd'],
      correctAnswer: 0,
      subject: 'math'
    }));

    Quiz.find.mockReturnValueOnce({ limit: () => mockQuestions });

    const res = await request(app).get('/api/quiz/math');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(10);
    expect(Quiz.find).toHaveBeenCalledWith({ subject: 'math' });
  });

  test('should return 404 if no questions found for the subject', async () => {
    Quiz.find.mockReturnValueOnce({ limit: () => [] });

    const res = await request(app).get('/api/quiz/science');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No questions found for subject: science');
  });

  test('should handle server error and return 500', async () => {
    Quiz.find.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app).get('/api/quiz/english');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Database error');
  });
});

