const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const { getResume, postResume, editResume, deleteResume } = require('../Controllers/resumeController')

//fetch resume using post '/api/resume/fetchResume'
router.post('/fetchResume', getResume)

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
], postResume)

// <--Edit Resume using put '/api/resume/editResume' -->
router.put('/editResume/:id', fetchuser, upload.single('resumeFile'), [
    body('resume_file')
], editResume)

//Delete Resume Using Delete '/api/resume/deleteResume'
router.delete('/deleteResume/:id', fetchuser, deleteResume)

module.exports = router;