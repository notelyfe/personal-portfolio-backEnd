const express = require('express');
const router = express.Router();
const Projects = require('../Models/Project')
var fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { uploadFile } = require("../MiddleWare/awsAuth")

//Fetching all projects using post: '/api/projects/getprojects'
router.post('/getprojects', async (req, res) => {

    const projects = await Projects.find();
    res.json(projects)
})

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
], async (req, res) => {

    try {
        const file = req.file

        const project_image = await uploadFile(file)

        const date_created = Date.now()

        const project = new Projects({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            project_link: req.body.project_link,
            website_link: req.body.website_link,
            isActive: true,
            created_On: date_created,
            updated_On: null,
            project_image: project_image.Location
        });

        const saveProject = await project.save()
        console.log("project saved")
        res.json(saveProject)

    } catch (error) {
        res.send(error)
    }
})

//Edit project using put "/api/projects/editProject"
router.put('/editProject/:id', fetchuser, upload.single("projectImage"), [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('project_link').isLength({ min: 5 }),
    body('website_link').isLength({ min: 5 }),
    body('project_image'),
], async (req, res) => {
    try {
        let project = await Projects.findById(req.params.id)
        if (!project) {
            res.status(404).json({ message: "Not Found" })
        }

        if (project.user.toString() === req.user.id) {

            let file = req.file

            const project_image = await uploadFile(file)

            const date_updated = Date.now()

            const update_project = ({
                title: req.body.title,
                description: req.body.description,
                project_link: req.body.project_link,
                website_link: req.body.website_link,
                updated_On: date_updated,
                project_image: project_image.Location
            });

            const project_updated = await Projects.findByIdAndUpdate({ _id: req.params.id }, update_project)
            res.json(project_updated)

        } else {
            return res.status(401).json({ message: "Action Not allowed" })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
})

//Hide Project using patch '/api/projects/status'
router.patch('/status/:id', fetchuser, async (req, res) => {

    try {
        const project = await Projects.findById(req.params.id)

        if (!project) {
            res.status(404).send("Not Found")
        }

        if (project.user.toString() === req.user.id) {

            let status = ({
                isActive: !project?.isActive
            })

            const updated_Status = await Projects.findByIdAndUpdate({ _id: req.params.id }, status)

            res.status(200).json({ message: 'Status Updated' })
        }
        else {
            res.status(401).json({ message: "Action Not Allowed" })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})


//Delete Project Using Delete '/api/projects/deleteProject'
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
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;