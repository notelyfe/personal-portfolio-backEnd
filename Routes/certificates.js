const Certificate = require('../Models/Certificate');
const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');
const multer = require('multer')

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

const upload = multer({
    storage: Storage
}).single('certificateImage')

//add certificate using post '/api/certificates/addCertificate'
router.post('/addCertificate', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('issued_by').isLength({ min: 3 }),
    body('certificate_image'),
], async (req, res) => {
    
        upload(req, res, (err) => {
            if (err) {
                console.log(err)
            } else {
                const newCertificate = new Certificate({
                    user: req.user.id,
                    title: req.body.title,
                    issued_by: req.body.issued_by,
                    certificate_image: {
                        data: req.file.filename,
                        contentType: 'image/png'
                    }
                })
                newCertificate.save()
                    .then(() => res.send('uploaded successfully'))
                    .catch(err => console.log(err))
            }
        })
})

module.exports = router;