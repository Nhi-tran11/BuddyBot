const express = require('express');
const router = express.Router();
const { submitScore, getLeaderboard, getLeaderboardBySubject } = require('../controllers/scoreController');


router.post('/', submitScore);
router.get('/leaderboard', getLeaderboard);
router.get('/leaderboard/:subject', getLeaderboardBySubject); // by subjwct

module.exports = router;
