const Projects = require('../Models/Project')
const { uploadFile, deleteFile } = require("../Services/awsAuth")
const { sendNotification } = require('../Controllers/notificationController')

const getprojects = async (req, res) => {

    const projects = await Projects.find().select(["-project_key", "-user"]);
    res.json(projects)
}

const addproject = async (req, res) => {

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
            project_image: project_image.Location,
            project_key: project_image.Key
        });

        const saveProject = await project.save()
        res.json(saveProject)

        sendNotification(req.user.id, `New Project named "${req.body.title}" is added in the collection`, "Create", "Success")

    } catch (error) {
        res.status(400).json(error)
        sendNotification(req.user.id, `Your New Project didn't saved on collection, It Exit with status code "400"`, "Create", "Error")
    }
}

const editProject = async (req, res) => {

    try {

        let project = await Projects.findById(req.params.id)

        if (!project) {
            res.status(404).json({ message: "Not Found" })
        }
        else {

            if (project.user.toString() === req.user.id) {

                let file = req.file

                if (file.filename !== project.project_key) {

                    deleteFile(project.project_key)

                }

                const project_image = await uploadFile(file)

                const date_updated = Date.now()

                const update_project = ({
                    title: req.body.title,
                    description: req.body.description,
                    project_link: req.body.project_link,
                    website_link: req.body.website_link,
                    updated_On: date_updated,
                    project_image: project_image.Location,
                    project_key: project_image.Key
                });

                await Projects.findByIdAndUpdate({ _id: req.params.id }, update_project)

                res.status(200).json({ message: "Projcet Updated Successfully" })

                sendNotification(req.user.id, `Project named "${req.body.title}" is edited`, "Edit", "Success")

            } else {
                return res.status(401).json({ message: "Action Not allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const updateStatus = async (req, res) => {

    try {

        const project = await Projects.findById(req.params.id)

        if (!project) {
            res.status(404).json({ message: "Not Found" })
        }
        else {
            if (project.user.toString() === req.user.id) {

                let status = ({
                    isActive: !project?.isActive
                })

                await Projects.findByIdAndUpdate({ _id: req.params.id }, status)

                res.status(200).json({ message: 'Status Updated' })

                sendNotification(req.user.id, `Project Status is Updated to ${status.isActive} for project "${project.title}"`, "Status Update", "Success")
            }
            else {
                res.status(401).json({ message: "Action Not Allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProject = async (req, res) => {

    try {

        let project = await Projects.findById(req.params.id)

        if (!project) {
            res.status(404).json({ message: "Not Found" })
        }
        else {
            if (project.user.toString() === req.user.id) {

                deleteFile(project.project_key)

                await Projects.findByIdAndDelete(req.params.id)

                res.json({ message: "Project has Been Deleted" })

                sendNotification(req.user.id, `Project named "${project.title}" is deleted permanently`, "Delete", "Success")

            } else {
                return res.status(401).json({ message: "Action Not allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getprojects,
    addproject,
    editProject,
    updateStatus,
    deleteProject
}