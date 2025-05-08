const mongoose = require('mongoose');
const Quiz = require('./model/quizModel');

mongoose.connect('mongodb+srv://nhi:1234@cluster0.hkgqh7i.mongodb.net/buddybot?retryWrites=true&w=majority&appName=Cluster0');

Quiz.find()
  .then(data => {
    console.log("📦 All quizzes in DB:");
    console.log(data);
    mongoose.connection.close();
  })
  .catch(err => console.error("Error fetching data:", err));

const data = [
  { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
  { question: "10 - 6 = ?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
  { question: "3 x 3 = ?", options: ["6", "8", "9", "12"], correctAnswer: 2 },
  { question: "8 / 2 = ?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
  { question: "7 + 1 = ?", options: ["6", "7", "8", "9"], correctAnswer: 2 },
  { question: "5 + 5 = ?", options: ["10", "9", "11", "12"], correctAnswer: 0 },
  { question: "9 - 4 = ?", options: ["4", "5", "6", "7"], correctAnswer: 1 },
  { question: "6 x 2 = ?", options: ["10", "12", "14", "18"], correctAnswer: 1 },
  { question: "15 / 5 = ?", options: ["2", "3", "4", "5"], correctAnswer: 1 },
  { question: "1 + 6 = ?", options: ["6", "7", "8", "9"], correctAnswer: 1 },
];

Quiz.insertMany(data)
  .then(() => {
    console.log("✅ Seeded 10 quiz questions to MongoDB");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Seeding failed:", err));