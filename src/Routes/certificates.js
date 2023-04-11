const Certificate = require('../Models/Certificate');
const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser');
const { body } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile } = require('../MiddleWare/awsAuth')

//fetch certificates using post '/api/certificates/fetchCertificate'
router.post('/fetchCertificate', async (req, res) => {
    const certificates = await Certificate.find();
    res.json(certificates)
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

        const newCertificate = new Certificate({
            user: req.user.id,
            title: req.body.title,
            issued_by: req.body.issued_by,
            certificate_image: image.Location,
        });

        const saveCertificate = newCertificate.save()
        
        res.json(saveCertificate)

    } catch (error) {
        res.send(error)
    }
})

//Delete Certificate using delete '/api/certificate/deleteCertificate/'
router.delete('/deleteCertificate/:id', fetchuser, async (req, res) => {
    try {
        let certificate = await Certificate.findById(req.params.id)
        if (!certificate) {
            res.status(404).send("Not Found")
        }

        if (certificate.user.toString() !== req.user.id) {
            return res.status(401).send("Action Not allowed")
        }

        certificate = await Certificate.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Certificate has Been Deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;