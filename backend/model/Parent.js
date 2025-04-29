const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }],
    role: {
        type: String,
        default: 'parent'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Parent', parentSchema);