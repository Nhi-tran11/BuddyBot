const express = require('express');
const router = express.Router();
const Lesson = require('../model/lesson'); // ✅ your Lesson model

// ✅ GET all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ _id: -1 });
    res.status(200).json({ lessons });
  } catch (err) {
    console.error('Failed to fetch lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

module.exports = router;
