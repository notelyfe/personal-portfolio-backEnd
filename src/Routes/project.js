const express = require('express');
const router = express.Router();
var fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const { getprojects, addproject, editProject, updateStatus, deleteProject } = require('../Controllers/projectController')

//Fetching all projects using post: '/api/projects/getprojects'
router.post('/getprojects', getprojects)

//creating image buffer
const Storage = multer.diskStorage({
    destination: './portfolioFiles/projects',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage })

//Adding project using post: '/api/projects/addproject  //login require
router.post('/addproject', fetchuser, upload.single("projectImage"), [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('project_link').isLength({ min: 5 }),
    body('website_link').isLength({ min: 5 }),
    body('project_image'),
], addproject)

//Edit project using put "/api/projects/editProject"
router.put('/editProject/:id', fetchuser, upload.single("projectImage"), [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('project_link').isLength({ min: 5 }),
    body('website_link').isLength({ min: 5 }),
    body('project_image'),
], editProject)

//Hide Project using patch '/api/projects/status'
router.patch('/status/:id', fetchuser, updateStatus)

//Delete Project Using Delete '/api/projects/deleteProject'
router.delete('/deleteProject/:id', fetchuser, deleteProject)

module.exports = router;