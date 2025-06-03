const Score = require('../model/scoreModel');

exports.submitScore = async (req, res) => {
    const { playerName, score, total } = req.body;
  console.log("📥 Incoming score:", playerName, score, total);

  try {
    const newScore = new Score({ playerName, score, total });
    await newScore.save();
    console.log("✅ Score saved to DB");
    res.status(201).json({ message: "Score saved!" });
  } catch (err) {
    console.error("❌ Failed to save score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
};