const express = require('express');
const router = express.Router();
const Resume = require('../Models/Resume');
const fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { uploadFile, deleteFile } = require("../Services/awsAuth")

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

        const post_date = Date.now()

        const newResume = new Resume({
            user: req.user.id,
            resume_file: resume.Location,
            posted_On: post_date,
            updated_On: null,
            resume_key: resume.Key
        })

        const saveResume = await newResume.save()

        res.json(saveResume)

    } catch (error) {
        res.send(error)
    }
})

// <--Edit Resume using put '/api/resume/editResume' -->
router.put('/editResume/:id', fetchuser, upload.single('resumeFile'), [
    body('resume_file')
], async (req, res) => {

    try {

        let resume = await Resume.findById(req.params.id)

        if (!resume) {
            res.status(404).json({ message: "Resume Not Found" })
        } else {

            if (resume.user.toString() === req.user.id) {

                const file = req.file

                if (file.filename !== resume.resume_key) {

                    deleteFile(resume.resume_key)

                }

                const resume_new = await uploadFile(file)

                const updated_On = Date.now()

                let updatedData = ({
                    resume_file: resume_new.Location,
                    updated_On: updated_On,
                    resume_key: resume_new.Key
                })

                await Resume.findByIdAndUpdate({ _id: req.params.id }, updatedData)

                res.status(200).json({ message: "Resume Updated Successfully" })

            } else {
                res.status(400).json({ message: "Action Not Allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

})

//Delete Resume Using Delete '/api/resume/deleteResume'
router.delete('/deleteResume/:id', fetchuser, async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) {
            res.status(404).json({ message: "Resume Not Found" })
        }
        if (resume.user.toString() === req.user.id) {

            resume = await Resume.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "Resume has Been Deleted" })

        } else {
            return res.status(401).json({ message: 'Action Not Allowed' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;