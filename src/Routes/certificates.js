const Certificates = require('../Models/Certificate');
const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser');
const { body } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
const { uploadFile } = require('../MiddleWare/awsAuth')

//fetch certificates using post '/api/certificates/fetchCertificate'
router.post('/fetchCertificate', async (req, res) => {
    const fetch_certificates = await Certificates.find();
    res.json(fetch_certificates)
})

//creating image bufffer
const Storage = multer.diskStorage({
    destination: './portfolioFiles/certificates',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage })

//add certificate using post '/api/certificates/addCertificate'
router.post('/addCertificate', fetchuser, upload.single("certificateImage"), [
    body('title').isLength({ min: 3 }),
    body('issued_by').isLength({ min: 3 }),
    body('certificate_image'),
], async (req, res) => {

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
        });

        const saveCertificate = await newCertificate.save()

        res.json(saveCertificate)

    } catch (error) {
        res.send(error)
    }
})

// edit certificate using put "/api/certificates/editCertificate"
router.put('/editCertificate/:id', fetchuser, upload.single("certificateImage"), [
    body('title').isLength({ min: 3 }),
    body('issued_by').isLength({ min: 3 }),
    body('certificate_image'),
], async (req, res) => {
    try {

        let certificate = await Certificates.findById(req.params.id)

        if (!certificate) {
            res.status(404).json({ message: "No Found" })
        }

        if (certificate.user.toString() === req.user.id) {

            let file = req.file

            const image = await uploadFile(file)

            let updatedOn = Date.now()

            const update_certificate = ({
                title: req.body.title,
                issued_by: req.body.issued_by,
                updated_On: updatedOn,
                certificate_image: image.Location,
            })

            const certificate_updated = await Certificates.findByIdAndUpdate({ _id: req.params.id }, update_certificate)

            res.status(200).json({ message: 'Certificate Updated Successfully' })

        }
        else {
            return res.status(401).json({ message: "Action Not allowed" })
        }

    } catch (error) {
        res.json(error)
    }
})

//update certificate Status using patch '/api/certificates/status
router.patch('/status/:id', fetchuser, async (req, res) => {
    try {

        let certificate = await Certificates.findById(req.params.id)

        if (!certificate) {
            res.status(404).json({ message: "Not Found" })
        }

        if (certificate.user.toString() === req.user.id) {

            let status = ({
                isActive: !certificate?.isActive
            })

            const updated_status = await Certificates.findByIdAndUpdate({ _id: req.params.id }, status)

            res.status(200).json({ message: "Status Updated Successfully" })

        } else {
            return res.status(401).json({ message: 'Action Not Allowed' })
        }
    } catch (error) {
        console.log(error)
    }
})

//Delete Certificate using delete '/api/certificates/deleteCertificate/'
router.delete('/deleteCertificate/:id', fetchuser, async (req, res) => {
    try {
        let certificate = await Certificates.findById(req.params.id)
        if (!certificate) {
            res.status(404).send("Not Found")
        }

        if (certificate.user.toString() !== req.user.id) {
            return res.status(401).send("Action Not allowed")
        }

        certificate = await Certificates.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Certificate has Been Deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;