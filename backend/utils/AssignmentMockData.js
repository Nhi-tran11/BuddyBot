const mongoose = require('mongoose');

// Sample user IDs - replace these with actual IDs from your database
const parentIds = [
  "6578e4d0c52e6f1d3a9b4567",  // Replace with actual parent user IDs
  "6578e4d0c52e6f1d3a9b4568"
];

const childIds = [
  "6578e4d0c52e6f1d3a9b4569",  // Replace with actual child user IDs
  "6578e4d0c52e6f1d3a9b456a",
  "6578e4d0c52e6f1d3a9b456b"
];

// Sample assignments data to insert into MongoDB
const assignmentData = [
  {
    title: "Basic Addition and Subtraction",
    description: "Practice adding and subtracting single-digit numbers",
    questions: [
      {
        question: "What is 5 + 3?",
        answer: "8",
        options: ["6", "7", "8", "9"],
        type: "multiple-choice"
      },
      {
        question: "What is 9 - 4?",
        answer: "5",
        options: ["3", "4", "5", "6"],
        type: "multiple-choice"
      }
    ],
    assignedTo: childIds[0],
    assignedBy: parentIds[0],
    subject: "math",
    difficulty: "easy",
    dueDate: new Date("2025-05-10"),
    status: "pending",
    score: null,
    aiGenerated: true,
    aiPrompt: "Create a basic math assignment for 6-8 year olds",
    ageRange: "6-8"
  },
  {
    title: "Reading Comprehension",
    description: "Read the short story and answer questions about it",
    questions: [
      {
        question: "Who is the main character in the story?",
        answer: null,
        type: "open-ended"
      },
      {
        question: "Where does the story take place?",
        answer: null,
        type: "open-ended"
      }
    ],
    assignedTo: childIds[1],
    assignedBy: parentIds[0],
    subject: "english",
    difficulty: "medium",
    dueDate: new Date("2025-05-15"),
    status: "in-progress",
    score: null,
    aiGenerated: false,
    aiPrompt: null,
    ageRange: "9-12"
  },
  {
    title: "Solar System Quiz",
    description: "Test your knowledge about planets and space",
    questions: [
      {
        question: "Is Earth the largest planet in our solar system?",
        answer: "False",
        options: ["True", "False"],
        type: "true-false"
      },
      {
        question: "Which planet is known for its rings?",
        answer: "Saturn",
        options: ["Jupiter", "Mars", "Saturn", "Neptune"],
        type: "multiple-choice"
      }
    ],
    assignedTo: childIds[2],
    assignedBy: parentIds[1],
    subject: "science",
    difficulty: "medium",
    dueDate: new Date("2025-05-08"),
    status: "completed",
    score: 85,
    aiGenerated: true,
    aiPrompt: "Create a solar system quiz for elementary students",
    ageRange: "9-12"
  },
  {
    title: "Dinosaur Matching Activity",
    description: "Match dinosaur names with their characteristics",
    questions: [
      {
        question: "Match the dinosaurs to their diet",
        answer: null,
        options: ["Tyrannosaurus - Carnivore", "Triceratops - Herbivore", "Velociraptor - Carnivore"],
        type: "matching"
      }
    ],
    assignedTo: childIds[0],
    assignedBy: parentIds[1],
    subject: "science",
    difficulty: "easy",
    dueDate: new Date("2025-06-01"),
    status: "pending",
    score: null,
    aiGenerated: false,
    aiPrompt: null,
    ageRange: "6-8"
  },
  {
    title: "Basic Fractions",
    description: "Introduction to fractions and their representations",
    questions: [
      {
        question: "What fraction of the shape is colored?",
        answer: "1/4",
        options: ["1/2", "1/3", "1/4", "1/5"],
        type: "multiple-choice"
      },
      {
        question: "Draw a circle and shade in 3/4 of it",
        answer: null,
        type: "open-ended"
      }
    ],
    assignedTo: childIds[1],
    assignedBy: parentIds[0],
    subject: "math",
    difficulty: "medium",
    dueDate: new Date("2025-05-20"),
    status: "overdue",
    score: null,
    aiGenerated: true,
    aiPrompt: "Create a fractions worksheet for elementary students",
    ageRange: "9-12"
  }
];

// Export the mock data for use elsewhere
module.exports = {
  assignmentData,
  parentIds,
  childIds
};