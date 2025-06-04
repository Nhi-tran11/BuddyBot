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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});


module.exports = router;
