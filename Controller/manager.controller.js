const adminModel = require('../Model/admin.model');
const managerModel = require('../Model/manager.model');
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
                let response = await managerModel.create(data);
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
exports.fetchAllManagers = async (req, res) => {
    try {
        let managers = await managerModel.find()
        return res.json(managers)
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.fetchManager = async (req, res) => {
    try {
        let manager = await managerModel.findById(req.params._id);
        return res.status(200).json(manager)
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.findSpecificManager = async (req, res) => {
    try {
        let searchQuery = req.query.query;
        let manager = await managerModel.findOne({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } },
            ]
        });
        return res.status(200).json(manager);


    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.findManagers = async (req, res) => {
    try {
        let searchQuery = req.query.query
        let response = await managerModel.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } },
            ]
        });
        console.log(response);
        return res.json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.login = async (req, res) => {
    try {
        if ((req?.body?.username || req?.body?.email) && req?.body?.password) {
            let manager = null
            if (req.body.username) manager = await managerModel.findOne({ username: req.body.username });
            else manager = await managerModel.findOne({ email: req.body.email })
            if (!manager) return res.status(401).json('Invalid Credentials');

            let data = req.body;
            let isValid = await bcrypt.compare(data.password, manager.password);

            if (isValid === true) {
                let token = jwt.sign({
                    _id: manager._id,
                    username: manager.username,
                    email: manager.email,
                    displayName: manager.displayName,
                }, process.env.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '12h',
                })
                return res.status(200).json(token);
            }
        }
        else return res.status(401).json('Bad Request');
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server Error');
    }
}