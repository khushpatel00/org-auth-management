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
                let SUPERADMINS = await adminModel.find({ role: 7 });
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
            })


            if (existsAdmin) return res.json({
                message: 'admin already exists',
            })
            else {
                res.status(201).json('admin added successfully')
            }


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

exports.login = async (req, res) => {
    try {
        if (req.body?.username && req.body?.password) {
            let admin = null;
            if (req.body.username) admin = await adminModel.findOne({ username: req.body.username })
            else admin = await adminModel.findOne({ email: req.body.email })
            if (!admin) return res.status(401).json('Invalid Credential');

            let isValid = await bcrypt.compare(req.body.password, admin.password)
            console.log(isValid)

            if (isValid) {
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