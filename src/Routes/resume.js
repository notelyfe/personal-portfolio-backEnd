const express = require('express');
const router = express.Router();
const Resume = require('../Models/Resume');
const fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

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

const upload = multer({ storage: Storage })

//add resume using post '/api/resume/addResume'
router.post('/addResume', fetchuser, upload.single('resumeFile'), [
    body('resume_file'),
    body('download_link').isLength({ min: 5 })
], (req, res) => {

    const newResume = new Resume({
        user: req.user.id,
        download_link: req.body.download_link,
        resume_file: {
            data: fs.readFileSync('./portfolioImages/resume/' + req.file.filename),
            contentType: 'image/png'
        }
    })
    newResume.save()
        .then((res) => {
            console.log("Resume upload success")
        })
        .catch((err) => {
            console.log(err, "Error occur")
        });
    res.send('Resume upload success')

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
        res.json({ "Success": "Resume has Been Deleted"})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;