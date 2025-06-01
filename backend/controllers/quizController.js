const Quiz = require('../model/quizModel');

exports.getQuestionsBySubject = async (req, res) => {
  const subject = req.params.subject.toLowerCase();

  try {
    const questions = await Quiz.find({ subject }).limit(10);
    if (!questions.length) {
      return res.status(404).json({ message: `No questions found for subject: ${subject}` });
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
