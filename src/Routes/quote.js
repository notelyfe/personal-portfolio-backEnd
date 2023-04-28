const express = require('express');
const router = express.Router()
const fetchuser = require('../MiddleWare/fetchuser')
const { body } = require('express-validator');
const { fetchQuotes, postQuote, updateStatus, deleteQuote } = require('../Controllers/quoteController')

//fetch quotes using post '/api/quotes/fetchQuotes'
router.post('/fetchQuotes', fetchQuotes)

//add quotes using post '/api/quotes/addQuotes'
router.post('/addQuotes', fetchuser, [
    body("quote").isLength({ min: 5 }),
], postQuote)

// <--Edit Status--> using patch '/api/quotes/status'
router.patch('/status/:id', fetchuser, updateStatus)

//Delete Quotes Using Delete '/api/quotes/deleteQuote'
router.delete('/deleteQuote/:id', fetchuser, deleteQuote)

module.exports = router;