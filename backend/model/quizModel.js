const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  subject: {
    type: String,
    required: true,
    enum: ['math', 'science', 'english', 'gk']
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
