// controllers/lessonController.js
const Lesson = require('../model/lesson');

// POST /api/lessons
exports.createLesson = async (req, res) => {
  try {
    const { title, subject, description, videoUrl, icon } = req.body;
    const lesson = await Lesson.create({ title, subject, description, videoUrl, icon });
    res.status(201).json(lesson);
  } catch (error) {
    console.error("Lesson create error:", error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
};

// GET /api/lessons?subject=Mathematics
exports.getLessonsBySubject = async (req, res) => {
  try {
    const subject = req.query.subject;
    const lessons = await Lesson.find({ subject });
    res.json(lessons);
  } catch (error) {
    console.error("Fetch lessons error:", error);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
};
