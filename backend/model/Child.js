const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    childName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: true
    },
    role: {
        type: String,
        default: 'child'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Child', childSchema);