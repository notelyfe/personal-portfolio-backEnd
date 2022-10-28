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
        const quotes = new Quotes({ quote, display, user: req.user.id })
        const saveQuote = await quotes.save()
        res.json(saveQuote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

//Delete Quotes Using Delete '/api/quotes/deleteQuote'
router.delete('/deleteQuote/:id', fetchuser, async (req, res) => {
    try {
        let quote = await Quotes.findById(req.params.id);
        if (!quote) {
            res.status(404).send("Quote Not Found")
        }
        if (quote.user.toString() !== req.user.id) {
            return res.status(401).send('Action Not Allowed')
        }

        quote = await Quotes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Quotes has Been Deleted"})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;