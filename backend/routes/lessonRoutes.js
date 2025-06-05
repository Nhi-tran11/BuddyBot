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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI(process.env.API_KEY);

router.post('/details', async (req, res) => {
  const { title } = req.body;
  try {
    const model = ai.getGenerativeModel({
      model: 'models/gemini-2.0-flash' // ✅ works with v1beta
    });

    const prompt = `You're a children's educational assistant. Based on the lesson title "${title}", give:
    
    1. A short, friendly 2-line summary
    2. 3 main topics it may cover
    3. 2 book or PDF recommendations (can be generic titles)

    Keep it helpful and simple for a child.`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = result.response.text();
    res.json({ response: text });
  } catch (err) {
    console.error("❌ GenAI failed:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});


module.exports = router;
