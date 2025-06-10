const request = require('supertest');
const express = require('express');
const Score = require('../model/scoreModel');
const scoreRoutes = require('../routes/scoreRoutes');

jest.mock('../model/scoreModel');

describe('Score API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/score/leaderboard - should return top 10 scores', async () => {
    const mockScores = Array(10).fill().map((_, i) => ({
      playerName: `Player${i}`,
      score: 100 - i,
      total: 100,
      subject: 'math'
    }));
    Score.find.mockReturnValueOnce({
      sort: () => ({ limit: () => mockScores })
    });

    const res = await request(app).get('/api/score/leaderboard');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(10);
    expect(res.body[0].playerName).toBe('Player0');
  });

  test('GET /api/score/leaderboard/:subject - should return scores filtered by subject', async () => {
    const subject = 'science';
    const mockSubjectScores = [
      { playerName: 'Alice', score: 95, subject },
      { playerName: 'Bob', score: 90, subject }
    ];
    Score.find.mockReturnValueOnce({
      sort: () => mockSubjectScores
    });

    const res = await request(app).get(`/api/score/leaderboard/${subject}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].subject).toBe(subject);
  });

  test('POST /api/score - should save a new score', async () => {
    const newScore = {
      playerName: 'TestPlayer',
      score: 85,
      total: 100,
      subject: 'gk'
    };

    Score.mockImplementation(() => ({
      save: jest.fn().mockResolvedValueOnce(newScore)
    }));

    const res = await request(app).post('/api/score').send(newScore);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Score saved!');
  });
});

const app = express();
app.use(express.json());
app.use('/api/score', scoreRoutes);
