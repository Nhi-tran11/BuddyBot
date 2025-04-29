const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {  // Fixed typo from 'usename'
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true,
        unique: false,  // Fixed typo from 'unuque'
        required: function() { return this.role === 'parent'; }
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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);