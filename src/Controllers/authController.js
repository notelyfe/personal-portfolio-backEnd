const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.jwtSecret

const createuser = async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ user_id: req.body.user_id });
        if (user) {
            return res.status(400).json({ success, error: 'User Already Exist' })
        }
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            user_id: req.body.user_id,
            password: securePass,
            user_type: "Admin"
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const access_token = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, access_token })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const login = async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, password } = req.body

    try {
        let user = await User.findOne({ user_id })
        if (!user) {
            return res.status(400).json({ success, error: 'Invalid Credentials' })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: 'Invalid Credentials' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const access_token = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, access_token })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const userData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
    }
}

module.exports = {
    createuser,
    login,
    userData
}