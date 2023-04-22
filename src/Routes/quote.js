const express = require('express');
const router = express.Router()
const Quotes = require('../Models/Quotes')
const fetchuser = require('../MiddleWare/fetchuser')
const { body, validationResult } = require('express-validator');

//fetch quotes using post '/api/quotes/fetchQuotes'
router.post('/fetchQuotes', async (req, res) => {
    const quotes = await Quotes.find().select(["-user", "-isActive"]);
    res.json(quotes)
})

//add quotes using post '/api/quotes/addQuotes'
router.post('/addQuotes', fetchuser, [
    body("quote").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let prev_quotes = await Quotes.find()

        let ids = []

        prev_quotes.map((item) => {
            if (item.isActive === true) {
                ids.push(item._id.toString())
            }
        })

        for (let i = 0; i < ids.length; i++) {
            await Quotes.findByIdAndUpdate({ _id: ids[i] }, { isActive: false })
        }

        let date_posted = Date.now()

        const quotes = new Quotes({
            user: req.user.id,
            quote: req.body.quote,
            isActive: true,
            posted_On: date_posted
        })

        await quotes.save()

        res.status(200).json({ message: "Quotes Saved" })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

})

//Delete Quotes Using Delete '/api/quotes/deleteQuote'
router.delete('/deleteQuote/:id', fetchuser, async (req, res) => {
    try {
        let quote = await Quotes.findById(req.params.id);
        if (!quote) {
            res.status(404).json({ message: "Quote Not Found" })
        }
        if (quote.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Action Not Allowed' })
        }

        quote = await Quotes.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Quotes has Been Deleted" })

    } catch (error) {
        res.send(error);
    }
})

module.exports = router;