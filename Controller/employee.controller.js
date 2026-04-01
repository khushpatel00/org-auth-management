const managerModel = require("../Model/manager.model");
const employeeModel = require("../Model/employee.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registerEmployee = async (req, res) => {
    try {
        let response;
        let authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else return res.status(401).json('Token Required')
        if (req.body.secure) response = jwt.verify(token, process.env.JWT_SECRET)
        else response = jwt.decode(token)
        let manager = await managerModel.findById(response._id).select('-isDeleted -__v');
        if (!manager) return res.status(401).json('Unauthorized Access');
        else {
            let data = req.body
            let keys = Object.keys(data);
            let fulfills = keys.includes('username' && 'password' && 'email');
            if (fulfills === false) return res.status(400).json('Insufficient Data')
            else {
                data.displayName ? '' : data.displayName = data.username;
                data.password = await bcrypt.hash(data.password, 5);
                data.role = 4;
                let response = await employeeModel.create(data).select('-password -isDeleted -__v');
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

exports.fetchAllEmployees = async (req, res) => {
    try {
        let employees = await employeeModel.find({ isDeleted: false }).select('-isDeleted -__v')
        return res.json(employees);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}

exports.fetchEmployee = async (req, res) => {
    try {
        let employee = await employeeModel.findById(req.params._id).select('-__v');
        if (employee.isDeleted === true) return res.status(404).json('employee not found');
        return res.status(200).json(employee)
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
    s
}

exports.findSpecificEmployee = async (req, res) => {
    try {
        let searchQuery = req.query.query;
        let employee = await employeeModel.findOne({
            $or: [
                { isDeleted: false },
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } },
            ]
        }).select('-isDeleted -__v');
        return res.status(200).json(employee);


    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}

exports.findEmployees = async (req, res) => {
    try {
        let searchQuery = req.query.query
        let response = await employeeModel.find({
            $or: [
                { isDeleted: false },
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } },
            ]
        }).select('-isDeleted -__v');
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
            let employee = null
            if (req.body.username) employee = await employeeModel.findOne({ username: req.body.username, isDeleted: false }).select('-isDeleted -__v');
            else employee = await employeeModel.findOne({ email: req.body.email, isDeleted: false }).select('-isDeleted -__v');
            if (!employee) return res.status(401).json('Invalid Credentials');

            let data = req.body;
            let isValid = await bcrypt.compare(data.password, employee.password);
            console.log(isValid)
            if (isValid === true) {
                let token = jwt.sign({
                    _id: employee._id,
                    username: employee.username,
                    email: employee.email,
                    displayName: employee.displayName,
                }, process.env.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '12h',
                })
                return res.status(200).json(token);
            } else return res.status(401).json('Invalid Credentials');

        }
        return res.status(401).json('Bad Request');
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server Error');
    }
}
exports.deleteEmployee = async (req, res) => {
    try {
        let employee = null;
        let authHeader = req.header.authorization;
        if (authHeader && authHeader.startsWith('Bearer '))
            token = authHeader.split(' ')[1]
        else return res.status(401).json('Token Required');

        let tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenData) employee = await employeeModel.findById(tokenData._id).select('-isDeleted -__v');
        if (!employee) return res.json('Invalid Token');
        if (employee.isDeleted === true) return res.status(404).json('employee not found')
        let response = await employeeModel.findByIdAndUpdate({ isDeleted: true })
        return res.status(200).json('Employee Deleted Successfully')
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }
}