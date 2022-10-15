const Certificate = require('../Models/Certificate');
const express = require('express');
const router = express.Router();
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');

//fetch certificates using post '/api/certificates/fetchCertificate'
router.post('/fetchCertificate', async (req, res) => {
    const certificates = await Certificate.find();
    res.json(certificates)
})

//add certificate using post '/api/certificates/addCertificate'
router.post('/addCertificate', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('certificate_link').isLength({ min: 5 }),
    body('issued_by'),
], async (req, res) => {

    const { title, certificate_link, issued_by } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const certificate = new Certificate({
            title, certificate_link, issued_by
        })
        const saveCertificate = await certificate.save()
        res.json(saveCertificate)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;