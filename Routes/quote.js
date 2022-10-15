const express = require('express');
const router = express.Router()
const Quotes = require('../Models/Quotes')
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');

//fetch quotes using post '/api/quotes/fetchQuotes'
router.post('/fetchQuotes', async (req, res) => {
    const quotes = await Quotes.find();
    res.json(quotes)
})

//add quotes using post '/api/quotes/addQuotes'
router.post('/addQuotes', fetchuser, [
    body("quote").isLength({ min: 5 }),
    body("display"),
], async (req, res) => {

    const { quote, display } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const quotes = new Quotes({
            quote, display
        })
        const saveQuote = await quotes.save()
        res.json(saveQuote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})
module.exports = router;