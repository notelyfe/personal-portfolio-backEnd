const express = require('express');
const router = express.Router();
const Projects = require('../Models/Project')
var fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');


//Fetching all projects using post: '/api/projects/getprojects'
router.post('/getprojects', async (req, res) => {

    const projects = await Projects.find();
    res.json(projects)
})

//Adding project using post: '/api/project/addproject  //login require
router.post('/addproject',fetchuser , [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('project_link').isLength({ min: 5 }),
    body('website_link').isLength({ min: 5 }),
], async ( req, res ) => {

    const { title, description, project_link, website_link } = req.body;
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const project = new Projects({
            title, description, project_link, website_link, user: req.user.id
        })
        const saveProject = await project.save()
        res.json(saveProject)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;