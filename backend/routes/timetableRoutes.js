const express = require('express');
const router = express.Router();
const Timetable = require('../model/timetable');

// Get all entries
router.get('/', async (req, res) => {
  try {
    const data = await Timetable.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new entry
router.post('/', async (req, res) => {
  const { day, time, subject } = req.body;
  try {
    const entry = new Timetable({ day, time, subject });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete entry
router.delete('/:id', async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
