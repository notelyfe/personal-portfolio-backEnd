const Certificates = require('../Models/Certificate');
const { uploadFile, deleteFile } = require('../Services/awsAuth')
const { sendNotification } = require('../Controllers/notificationController')

const fetchCertificate = async (req, res) => {
    const fetch_certificates = await Certificates.find().select(["-user", "-certificate_key"]);
    res.json(fetch_certificates)
}

const addCertificate = async (req, res) => {

    try {
        const file = req.file

        const image = await uploadFile(file)

        const createdOn = Date.now()

        const newCertificate = new Certificates({
            user: req.user.id,
            title: req.body.title,
            issued_by: req.body.issued_by,
            isActive: true,
            created_On: createdOn,
            updated_On: null,
            certificate_image: image.Location,
            certificate_key: image.Key
        });

        const saveCertificate = await newCertificate.save()

        res.json(saveCertificate)

        sendNotification(req.user.id, `New Certificate named "${req.body.title}" is added in the collection`, "Create", "Success")

    } catch (error) {
        res.status(400).json(error)
        sendNotification(req.user.id, `Your New Certificate didn't saved on collection, It Exit with status code "400"`, "Create", "Error")
    }
}

const editCertificate = async (req, res) => {
    try {

        let certificate = await Certificates.findById(req.params.id)

        if (!certificate) {
            res.status(404).json({ message: "No Found" })
        }
        else {

            if (certificate.user.toString() === req.user.id) {

                let file = req.file

                if (file.filename !== certificate.certificate_key) {

                    deleteFile(certificate.certificate_key)

                }

                const image = await uploadFile(file)

                let updatedOn = Date.now()

                const update_certificate = ({
                    title: req.body.title,
                    issued_by: req.body.issued_by,
                    updated_On: updatedOn,
                    certificate_image: image.Location,
                    certificate_key: image.Key
                })

                await Certificates.findByIdAndUpdate({ _id: req.params.id }, update_certificate)

                res.status(200).json({ message: 'Certificate Updated Successfully' })

                sendNotification(req.user.id, `Certificate named "${req.body.title}" is edited`, "Edit", "Success")

            }
            else {
                return res.status(401).json({ message: "Action Not allowed" })
            }
        }

    } catch (error) {
        res.json(error)
    }
}

const updateStatus = async (req, res) => {
    try {

        let certificate = await Certificates.findById(req.params.id)

        if (!certificate) {
            res.status(404).json({ message: "Not Found" })
        }
        else {

            if (certificate.user.toString() === req.user.id) {

                let status = ({
                    isActive: !certificate?.isActive
                })

                await Certificates.findByIdAndUpdate({ _id: req.params.id }, status)

                res.status(200).json({ message: "Status Updated Successfully" })

                sendNotification(req.user.id, `Certificate Status is Updated to ${status.isActive} for certificate "${certificate.title}"`, "Status Update", "Success")

            } else {
                return res.status(401).json({ message: 'Action Not Allowed' })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCertificate = async (req, res) => {

    try {

        let certificate = await Certificates.findById(req.params.id)

        if (!certificate) {
            res.status(404).json({ message: "Not Found" })
        }
        else {

            if (certificate.user.toString() === req.user.id) {

                deleteFile(certificate.certificate_key)

                certificate = await Certificates.findByIdAndDelete(req.params.id)

                res.json({ message: "Certificate has Been Deleted" })

                sendNotification(req.user.id, `Certificate named "${certificate.title}" is deleted permanently`, "Delete", "Success")

            }
            else {

                return res.status(401).json({ message: "Action Not allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    fetchCertificate,
    addCertificate,
    editCertificate,
    updateStatus,
    deleteCertificate
}