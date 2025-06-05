const express = require('express');
const router = express.Router();
const Lesson = require('../model/lesson'); // ✅ your Lesson model

// ✅ CREATE a new lesson
router.post('/', async (req, res) => {
  try {
    const { title, subject,youtubeUrl } = req.body;

    // Basic validation
    if (!title || !youtubeUrl) {
      return res.status(400).json({ error: 'Title and YouTube URL are required' });
    }

    const newLesson = new Lesson({
      title,
      subject,
      youtubeUrl
    });

    await newLesson.save();
    res.status(201).json({ message: 'Lesson created', lesson: newLesson });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: 'Server error while creating lesson' });
  }
});

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

// ✅ DELETE a lesson by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// ✅ UPDATE a lesson by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        youtubeUrl: req.body.youtubeUrl
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson updated', lesson: updated });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

module.exports = router;
