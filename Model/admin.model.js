const mongoose = require('mongoose')

const adminschema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        required: false,
        default: 6, // 6 = read-write, 7 = rw-execute
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
    strict: true,
})

module.exports = mongoose.model('admin', adminschema);