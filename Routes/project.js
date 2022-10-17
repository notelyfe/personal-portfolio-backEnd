const express = require('express');
const router = express.Router();
const Projects = require('../Models/Project')
var fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

//Fetching all projects using post: '/api/projects/getprojects'
router.post('/getprojects', async (req, res) => {

    const projects = await Projects.find();
    res.json(projects)
})

//creating image buffer
const Storage = multer.diskStorage({
    destination: './portfolioImages/projects',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage })

//Adding project using post: '/api/project/addproject  //login require
router.post('/addproject', fetchuser, upload.single("projectImage"), [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('project_link').isLength({ min: 5 }),
    body('website_link').isLength({ min: 5 }),
    body('project_image'),
], (req, res) => {

    const project = new Projects({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        project_link: req.body.project_link,
        website_link: req.body.website_link,
        project_image: {
            data: fs.readFileSync('./portfolioImages/projects/' + req.file.filename),
            contentType: 'image/png'
        },
    });
    project.save()
        .then((res) => {
            console.log("Image saved")
        })
        .catch((err) => {
            console.log(err, "Error occur")
        });
        res.send('image saved')
})

module.exports = router;