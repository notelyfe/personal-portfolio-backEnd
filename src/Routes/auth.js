const express = require('express');
const router = express.Router()
const { body } = require('express-validator');
var fetchuser = require('../MiddleWare/fetchuser')
const { createuser, login, userData } = require('../Controllers/authController')


//create a user using post:'/api/auth/createuser'
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('user_id').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
], createuser)

//Login an existing user using: Post '/api/auth/login'
router.post('/login', login)

//get loggedin user data using post: '/api/auth/userdata' login Require
router.get('/userdata', fetchuser, userData)

module.exports = router