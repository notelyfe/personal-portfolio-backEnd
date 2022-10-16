const express = require('express');
const router = express.Router();
const Resume = require('../Models/Resume');
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');
const multer = require('multer')

//fetch resume using post '/api/resume/fetchResume'
router.post('/fetchResume', async (req, res) => {
    const resume = await Resume.find()
    res.json(resume)
})

//creating image buffer
const Storage = multer.diskStorage({
    destination: './portfolioImages/resume',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('resumeFile')

//add resume using post '/api/resume/addResume'
router.post('/addResume', fetchuser, [
    body('resume_file'),
], (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        } else {
            const newResume = new Resume({
                user: req.user.id,
                resume_file: {
                    data: req.file.filename,
                    contentType: 'resume/pdf'
                }
            })
            newResume.save()
                .then(() => res.send('uploaded successfully'))
                .catch(err => console.log(err))
        }
    })
})

module.exports = router;