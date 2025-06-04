const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  youtubeUrl: { type: String, required: true }
});

module.exports = mongoose.model('lesson', lessonSchema);
