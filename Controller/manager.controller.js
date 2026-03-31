const adminModel = require('../Model/admin.model');
const bcrypt = require('bcrypt')
const { response } = require("express");
const jwt = require("jsonwebtoken");

exports.registerManager = async (req, res) => {
    try {
        let response;
        let authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else return res.status(401).json('Token Required')
        if (req.body.secure) response = jwt.verify(token, process.env.JWT_SECRET)
        else response = jwt.decode(token)
        let admin = await adminModel.findById(response._id);
        if (!admin) return res.status(401).json('Unauthorized Access');
        else if (admin.role >= 6) {
            let data = req.body
            let keys = Object.keys(data);
            let fulfills = keys.includes('username' && 'password' && 'email');
            if (fulfills === false) return res.status(400).json('Insufficient Data')
            else {

                data.displayName ? '' : data.displayName = data.username;
                data.password = await bcrypt.hash(data.password, 5);
                data.role = 5;
                let response = await adminModel.create(data);
                delete response.password;
                if (!req.body.login) return res.status(201).json(response);
                if (response._id) {
                    let token = jwt.sign({
                        _id: response._id,
                        displayName: response.displayName || response.username,
                        username: response.username,
                        email: response.email,
                    }, process.env.JWT_SECRET, {
                        algorithm: 'HS256',
                        expiresIn: '12h',
                    })
                    return res.status(201).json(token);
                }

                // fallback
                return res.status(201).json(response);
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.fetchAllManagers = (req, res) => {
    res.json('This Route is still in development!, will be available soon...')
}
exports.fetchManager = (req, res) => {
    res.json('This Route is still in development!, will be available soon...')
}
exports.findSpecificManager = (req, res) => {
    res.json('This Route is still in development!, will be available soon...')
}
exports.findManagers = (req, res) => {
    res.json('This Route is still in development!, will be available soon...')
}