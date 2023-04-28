const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser');
const { body } = require('express-validator');
const multer = require('multer');
const { fetchCertificate, addCertificate, editCertificate, updateStatus, deleteCertificate } = require('../Controllers/certificateController')

//fetch certificates using post '/api/certificates/fetchCertificate'
router.post('/fetchCertificate', fetchCertificate)

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
], addCertificate)

// edit certificate using put "/api/certificates/editCertificate"
router.put('/editCertificate/:id', fetchuser, upload.single("certificateImage"), [
    body('title').isLength({ min: 3 }),
    body('issued_by').isLength({ min: 3 }),
    body('certificate_image'),
], editCertificate)

//update certificate Status using patch '/api/certificates/status
router.patch('/status/:id', fetchuser, updateStatus)

//Delete Certificate using delete '/api/certificates/deleteCertificate/'
router.delete('/deleteCertificate/:id', fetchuser, deleteCertificate)

module.exports = router;