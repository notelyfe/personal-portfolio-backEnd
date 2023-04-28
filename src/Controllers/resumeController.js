const Resume = require('../Models/Resume');
const { uploadFile, deleteFile } = require("../Services/awsAuth")
const { sendNotification } = require('../Controllers/notificationController')

const getResume = async (req, res) => {
    const resume = await Resume.find().select(["-user", "-resume_key"])
    res.json(resume)
}

const postResume = async (req, res) => {

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

        sendNotification(req.user.id, "New Resume Upload", "Create", "Success")

    } catch (error) {
        res.send(error)
    }
}

const editResume = async (req, res) => {

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

                sendNotification(req.user.id, "Resume Updated", "Edit", "Success")

            } else {
                res.status(400).json({ message: "Action Not Allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}

const deleteResume = async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "Resume Not Found" })
        }
        if (resume.user.toString() === req.user.id) {

            deleteFile(resume.resume_key)

            resume = await Resume.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "Resume has Been Deleted" })

            sendNotification(req.user.id, "Resume Deleted", "Delete", "Success")

        } else {
            return res.status(401).json({ message: 'Action Not Allowed' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getResume,
    postResume,
    editResume,
    deleteResume
}