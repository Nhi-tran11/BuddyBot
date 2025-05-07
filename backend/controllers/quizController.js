const Quiz = require('../model/quizModel');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Quiz.find().limit(10);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
