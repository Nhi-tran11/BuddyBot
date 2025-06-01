const express = require('express');
const router = express.Router();
const { getQuestionsBySubject } = require('../controllers/quizController');

router.get('/:subject', getQuestionsBySubject);

module.exports = router;
