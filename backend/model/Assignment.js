const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], default: [] },
    answer: { type: String }
}, { _id: false });
const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // For AI-generated content
    questions: [questionSchema],
    // Who is the assignment for
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Who created the assignment
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Subject/Category
    subject: {
        type: String,
        enum: ['math', 'english', 'science', 'history', 'art', 'other'],
        default: 'other'
    },
    //Difficulty level
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    // Due date
    dueDate: {
        type: Date,
        required: true
    },
    // Completion status
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    // Child's score if applicable
    score: {
        type: String,
        default: 'not graded yet'
    },
    // Flag for AI-generated content
    aiGenerated: {
        type: Boolean,
        default: false
    },
    // Store the original prompt used to generate the assignment
    aiPrompt: {
        type: String
    },
    // For age-appropriate content
    ageRange: {
        type: String,
        enum: ['3-5', '6-8', '9-12', '13+'],
        default: '6-8'
    }
}, {
    timestamps: true
});

// Index for efficient querying
assignmentSchema.index({ assignedTo: 1, status: 1 });
assignmentSchema.index({ assignedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);