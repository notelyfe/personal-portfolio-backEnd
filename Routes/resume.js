const express = require('express');
const router = express.Router();
const Resume = require('../Models/Resume');
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');

//fetch resume using post '/api/resume/fetchResume'
router.post('/fetchResume', async (req, res) => {
    const resume = await Resume.find()
    res.json(resume)
})

//add resume using post '/api/resume/addResume'
router.post('/addResume', fetchuser, [
    body('resume_link').isLength({ min: 5 })
], async (req, res) => {

    const { resume_link } = req.body;

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const resume = new Resume({ resume_link })
        const saveResume = await resume.save()
        res.json(saveResume)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;