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
    }
})

module.exports = mongoose.model('admin', adminschema);