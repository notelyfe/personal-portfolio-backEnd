const express = require('express');
const router = express.Router()
const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var fetchuser = require('../MiddleWare/fetchuser')

const JWT_SECRET = process.env.jwtSecret

//create a user using post:'/api/auth/createuser'
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('user_id').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ user_id: req.body.user_id});
        if(user){
            return res.status(400).json({ success, error: 'User Already Exist' })
        }
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            user_id: req.body.user_id,
            password: securePass,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

//Login an existing user using: Post '/api/auth/login'
router.post('/login', async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {user_id, password} = req.body

    try {
        let user = await User.findOne({ user_id })
        if(!user){
            return res.status(400).json({ success, error: 'Invalid Credentials' })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({ success, error: 'Invalid Credentials' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })

    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
})

//get loggedin user data using post: '/api/auth/userdata' login Require
router.post('/userdata', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal Server error")
    }
})

module.exports = router