const Certificate = require('../Models/Certificate');
const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser');
const { body } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

//fetch certificates using post '/api/certificates/fetchCertificate'
router.post('/fetchCertificate', async (req, res) => {
    const certificates = await Certificate.find();
    res.json(certificates)
})

//creating image bufffer
const Storage = multer.diskStorage({
    destination: './portfolioImages/certificates',
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

    const newCertificate = new Certificate({
        user: req.user.id,
        title: req.body.title,
        issued_by: req.body.issued_by,
        certificate_image: {
            data: fs.readFileSync('./portfolioImages/certificates/' + req.file.filename),
            contentType: 'image/png'
        },
    });
    newCertificate.save()
        .then((res) => {
            console.log("certificate upload success")
        })
        .catch((err) => {
            console.log(err, "Error occur")
        });
    res.send('certificate upload success')

})

module.exports = router;