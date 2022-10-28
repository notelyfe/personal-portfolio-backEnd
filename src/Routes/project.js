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
    res.send("Image saved")
})

//Edit project using put "/api/project/editProject"
// router.put('/editProject/:id', fetchuser , async (req, res) => {

// })


//Delete Project Using Delete '/api/project/deleteProject'
router.delete('/deleteProject/:id', fetchuser, async (req, res) => {
    try {
        let project = await Projects.findById(req.params.id)
        if (!project) {
            res.status(404).send("Not Found")
        }

        if (project.user.toString() !== req.user.id) {
            return res.status(401).send("Action Not allowed")
        }

        project = await Projects.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Project has Been Deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;