const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: link to a user
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
