const adminModel = require('../Model/admin.model')

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
        return res.status(200).json({
            status: 'ok',
            uptime: process.uptime()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}
