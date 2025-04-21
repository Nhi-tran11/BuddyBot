const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {  // Fixed typo from 'usename'
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Fixed typo from 'unuque'
    },
    role: {
        type: String,
        enum: ['parent', 'child', 'admin'],
        required: true  // Removed duplicate required field
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.role === 'child'; }
    },
    childName: {
        type: String,
        required: function() { return this.role === 'child'; }
    },
    childAge: {
        type: Number,
        required: function() { return this.role === 'child'; }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);