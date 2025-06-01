const mongoose = require('mongoose');
const Quiz = require('./model/quizModel');

mongoose.connect('mongodb+srv://nhi:1234@cluster0.hkgqh7i.mongodb.net/buddybot?retryWrites=true&w=majority&appName=Cluster0');

// Math questions
const mathQuestions = [
  { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], correctAnswer: 1, subject: "math" },
  { question: "10 - 6 = ?", options: ["2", "3", "4", "5"], correctAnswer: 2, subject: "math" },
  { question: "3 x 3 = ?", options: ["6", "8", "9", "12"], correctAnswer: 2, subject: "math" },
  { question: "8 / 2 = ?", options: ["2", "3", "4", "5"], correctAnswer: 2, subject: "math" },
  { question: "7 + 1 = ?", options: ["6", "7", "8", "9"], correctAnswer: 2, subject: "math" },
  { question: "5 + 5 = ?", options: ["10", "9", "11", "12"], correctAnswer: 0, subject: "math" },
  { question: "9 - 4 = ?", options: ["4", "5", "6", "7"], correctAnswer: 1, subject: "math" },
  { question: "6 x 2 = ?", options: ["10", "12", "14", "18"], correctAnswer: 1, subject: "math" },
  { question: "15 / 5 = ?", options: ["2", "3", "4", "5"], correctAnswer: 1, subject: "math" },
  { question: "1 + 6 = ?", options: ["6", "7", "8", "9"], correctAnswer: 1, subject: "math" },
];

// Science questions
const scienceQuestions = [
  { question: "What planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, subject: "science" },
  { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correctAnswer: 1, subject: "science" },
  { question: "What is H2O commonly known as?", options: ["Oxygen", "Water", "Hydrogen", "Salt"], correctAnswer: 1, subject: "science" },
  { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: 2, subject: "science" },
  { question: "How many legs does an insect have?", options: ["4", "6", "8", "10"], correctAnswer: 1, subject: "science" },
  { question: "What part of the plant conducts photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"], correctAnswer: 2, subject: "science" },
  { question: "Which organ pumps blood in humans?", options: ["Liver", "Brain", "Heart", "Lungs"], correctAnswer: 2, subject: "science" },
  { question: "What type of animal is a frog?", options: ["Mammal", "Reptile", "Amphibian", "Bird"], correctAnswer: 2, subject: "science" },
  { question: "What is Earth’s only natural satellite?", options: ["Sun", "Mars", "Moon", "Venus"], correctAnswer: 2, subject: "science" },
  { question: "Which planet is closest to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: 2, subject: "science" },
];

// English questions
const englishQuestions = [
  { question: "Which is a noun?", options: ["Run", "Quick", "Apple", "Blue"], correctAnswer: 2, subject: "english" },
  { question: "What is the opposite of 'hot'?", options: ["Warm", "Cold", "Cool", "Chilly"], correctAnswer: 1, subject: "english" },
  { question: "Which word is a verb?", options: ["Jump", "Blue", "Happy", "Fast"], correctAnswer: 0, subject: "english" },
  { question: "Which is a synonym for 'smart'?", options: ["Dull", "Bright", "Lazy", "Slow"], correctAnswer: 1, subject: "english" },
  { question: "Choose the correct plural: 'child'", options: ["childs", "children", "childes", "childrens"], correctAnswer: 1, subject: "english" },
  { question: "What is the past tense of 'go'?", options: ["goed", "gone", "went", "goes"], correctAnswer: 2, subject: "english" },
  { question: "Which sentence is correct?", options: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."], correctAnswer: 1, subject: "english" },
  { question: "Which is a pronoun?", options: ["Run", "He", "Green", "Quick"], correctAnswer: 1, subject: "english" },
  { question: "Identify the adjective: 'The tall man ran fast.'", options: ["tall", "man", "ran", "fast"], correctAnswer: 0, subject: "english" },
  { question: "What punctuation ends a question?", options: [".", "!", ",", "?"], correctAnswer: 3, subject: "english" },
];

// General Knowledge questions
const gkQuestions = [
  { question: "What is the capital of New Zealand?", options: ["Auckland", "Wellington", "Christchurch", "Hamilton"], correctAnswer: 1, subject: "gk" },
  { question: "Who is the Prime Minister of India (2024)?", options: ["Rahul Gandhi", "Narendra Modi", "Amit Shah", "Manmohan Singh"], correctAnswer: 1, subject: "gk" },
  { question: "Which continent is Egypt in?", options: ["Asia", "Africa", "Europe", "Australia"], correctAnswer: 1, subject: "gk" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], correctAnswer: 2, subject: "gk" },
  { question: "What currency is used in Japan?", options: ["Won", "Yen", "Dollar", "Euro"], correctAnswer: 1, subject: "gk" },
  { question: "Which country has the most population?", options: ["USA", "India", "China", "Indonesia"], correctAnswer: 1, subject: "gk" },
  { question: "What is the smallest planet?", options: ["Mars", "Venus", "Pluto", "Mercury"], correctAnswer: 3, subject: "gk" },
  { question: "Which ocean is the largest?", options: ["Indian", "Pacific", "Atlantic", "Arctic"], correctAnswer: 1, subject: "gk" },
  { question: "Which sport uses a bat and ball?", options: ["Soccer", "Cricket", "Tennis", "Hockey"], correctAnswer: 1, subject: "gk" },
  { question: "Which festival is known as the festival of lights?", options: ["Holi", "Eid", "Diwali", "Christmas"], correctAnswer: 2, subject: "gk" },
];

// Insert all subjects
Quiz.insertMany([
  ...mathQuestions,
  ...scienceQuestions,
  ...englishQuestions,
  ...gkQuestions
])
  .then(() => {
    console.log("✅ Seeded 40 quiz questions to MongoDB (10 per subject)");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Seeding failed:", err));
