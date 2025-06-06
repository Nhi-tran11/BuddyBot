const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  total: Number,
  subject: String,
}, { timestamps: true});


module.exports = mongoose.model('Score', scoreSchema);
