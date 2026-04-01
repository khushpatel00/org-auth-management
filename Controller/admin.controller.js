const adminModel = require('../Model/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.registerAdmin = async (req, res) => {
    try {
        let data = req.body
        console.log(data);
        let keys = Object.keys(data);
        fulfills = keys.includes('username' && 'password' && 'email');
        if (fulfills === false) return res.status(400).json('Insufficient Data')
        else {
            console.log(data);
            if (data?.role >= 7) {
                let SUPERADMINS = await adminModel.find({ role: 7 }).select('-isDeleted -__v');
                if (SUPERADMINS.length >= 2) return res.status(401).json('You are not authorized for this specific action')
                else {
                    let response = await adminModel.create(data);
                    return res.status(201).json(response);
                }
            }
            let existsAdmin = await adminModel.findOne({
                $or: [
                    { username: data.username },
                    { email: data.email }
                ]
            }).select('-isDeleted -__v')
            if (existsAdmin) return res.json({ message: 'admin already exists', })
            else { res.status(201).json('admin added successfully') }
            data.displayName ? '' : data.displayName = data.username;
            data.password = await bcrypt.hash(data.password, 8);
            // fallback, if no role defined
            data.role = 6;
            await adminModel.create(data);
            // fallback
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }

}


exports.fetchAllAdmins = async (req, res) => {
    try {

        // let test = await adminModel.aggregate([
        //     {
        //         $project: {
        //             roleType: { $type: "$role" },
        //             deletedType: { $type: "$isDeleted" },
        //             role: 1,
        //             isDeleted: 1
        //         }
        //     }
        // ])
        // console.log(test);


        let admins = await adminModel.find({ role: 6, isDeleted: false }).select('-isDeleted -__v');
        return res.status(200).json(admins);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.fetchAdmin = async (req, res) => {
    try {
        let admin = await adminModel.findById(req.params._id).select('-__v');
        if (admin.isDeleted === true) return res.status(404).json('admin not found');
        return res.status(200).json(admin)
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.findSpecificAdmin = async (req, res) => {
    try {
        let searchQuery = req.query.query.toString();
        let response = await adminModel.findOne({
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
exports.findAdmins = async (req, res) => {
    try {
        let searchQuery = req.query.query
        let response = await adminModel.find({
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
        if (req.body?.username && req.body?.password) {
            let admin = null;
            if (req.body.username) admin = await adminModel.findOne({ username: req.body.username, isDeleted: false }).select('-isDeleted -__v')
            else admin = await adminModel.findOne({ email: req.body.email, isDeleted: false }).select('-isDeleted -__v')
            if (!admin) return res.status(401).json('Invalid Credential');
            let isValid = await bcrypt.compare(req.body.password, admin.password)
            console.log(isValid)
            if (isValid === true) {
                let token = jwt.sign({
                    _id: admin._id,
                    displayName: admin.displayName || admin.username,
                    username: admin.username,
                    email: admin.email,
                }, process.env.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '12h',
                })
                return res.status(200).json(token);
            }
            else return res.status(401).json('Invalid Credential');
        } else {
            return res.status(401).json('Bad Request');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
exports.deleteAdmin = async (req, res) => {
    try {
        let admin = null;
        let authHeader = req.header.authorization;
        if (authHeader && authHeader.startsWith('Bearer '))
            token = authHeader.split(' ')[1]
        else return res.status(401).json('Token Required');
        let tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenData) admin = await adminModel.findById(tokenData._id).select('-isDeleted -__v');
        if (!admin) return res.json('Invalid Token');
        if (admin.isDeleted === true) return res.status(404).json('admin not found')
        let response = await adminModel.findByIdAndUpdate({ isDeleted: true })
        return res.status(200).json('Admin Deleted Successfully')

    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }
}