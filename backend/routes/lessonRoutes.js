// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonsBySubject,
} = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessonsBySubject);

module.exports = router;
