// models/Lesson.js
const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  icon: { type: String, default: "/default.png" },
}, {
  timestamps: true
});

module.exports = mongoose.model("Lesson", LessonSchema);
