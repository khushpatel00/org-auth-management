const adminModel = require('../Model/admin.model')
const mongoose = require('mongoose');


exports.status = (req, res) => {
    try {
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

exports.health = (req, res) => {
    try {
        let state = mongoose.connection.readyState;
        return res.status(200).json({
            status: 'ok',
            database: state == 1 ? 'Connected' : 'Disconnected', 
            uptime: process.uptime()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}
