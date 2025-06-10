const Score = require('../model/scoreModel');

// Save a new score with subject
exports.submitScore = async (req, res) => {
  const { playerName, score, total, subject } = req.body;
  console.log("📥 Incoming score:", playerName, score, total, subject);

  try {
    const newScore = new Score({ playerName, score, total, subject });
    await newScore.save();
    console.log("✅ Score saved to DB");
    res.status(201).json({ message: "Score saved!" });
  } catch (err) {
    console.error("❌ Failed to save score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
};

// Fetch top 10 scores across all subjects
exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1 })
      .limit(10);
    res.json(topScores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Fetch scores filtered by subject
exports.getLeaderboardBySubject = async (req, res) => {
  try {
    const subject = req.params.subject;
    const scores = await Score.find({ subject }).sort({ score: -1, createdAt: 1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};