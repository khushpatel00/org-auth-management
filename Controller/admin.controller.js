const adminModel = require('../Model/admin.model');
const bcrypt = require('bcrypt');

exports.registerAdmin = async (req, res) => {
    try {
        let data = req.body
        console.log(data);
        let keys = Object.keys(data);
        fulfills = keys.includes('username' && 'password' && 'email');
        if (fulfills === false) return res.status(400).json('Insufficient Data')
        else {

            data.displayName ? '' : data.displayName = data.username;
            data.password = await bcrypt.hash(data.password, 17);

            console.log(data);

            if (keys.includes('role')) {
                let SUPERADMINS = await adminModel.find({ role: 7 });
                if (SUPERADMINS.length >= 2) return res.status(401).json('You are not authorized for this specific action')
                else {
                    let response = await adminModel.create(data);
                    return res.status(201).json(response);
                }
            }
            else {
                let response = await adminModel.create(req.body);
                return res.status(201).json(response);
            }

        }


    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }

}


exports.fetchAllAdmins = async (req, res) => {
    try {

        let admins = await adminModel.find({ role: 6 });
        return res.status(200).json(admins);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}


exports.fetchAdmin = async (req, res) => {
    try {
        let admin = await adminModel.findById(req.params._id);
        return res.status(200).json(admin)
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}


exports.findSpecificAdmin = async (req, res) => {
    try {
        let searchQuery = req.query.query
        let response = await adminModel.findOne({
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


exports.findAdmins = async (req, res) => {
    try {
        let searchQuery = req.query.query
        let response = await adminModel.find({
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