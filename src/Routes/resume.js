const express = require('express');
const router = express.Router();
const Resume = require('../Models/Resume');
const fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { uploadFile } = require("../Services/awsAuth")

//fetch resume using post '/api/resume/fetchResume'
router.post('/fetchResume', async (req, res) => {
    const resume = await Resume.find()
    res.json(resume)
})

//creating image buffer
const Storage = multer.diskStorage({
    destination: './portfolioFiles/resume',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage })

//add resume using post '/api/resume/addResume'
router.post('/addResume', fetchuser, upload.single('resumeFile'), [
    body('resume_file')
], async (req, res) => {

    try {
        const file = req.file

        const resume = await uploadFile(file)

        const newResume = new Resume({
            user: req.user.id,
            resume_file: resume.Location
        })

        const saveResume = newResume.save()

        res.json(saveResume)

    } catch (error) {
        res.send(error)
    }
})

//Delete Resume Using Delete '/api/resume/deleteResume'
router.delete('/deleteResume/:id', fetchuser, async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) {
            res.status(404).send("Resume Not Found")
        }
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).send('Action Not Allowed')
        }

        resume = await Resume.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Resume has Been Deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;