const Quotes = require('../Models/Quotes')
const { validationResult } = require('express-validator');
const { sendNotification } = require('../Controllers/notificationController')

const fetchQuotes = async (req, res) => {
    const quotes = await Quotes.find().select(["-user"]);
    res.json(quotes)
}

const postQuote = async (req, res) => {

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

        sendNotification(req.user.id, `New Quotation "${req.body.quote}" is Posted`, "Create", "Success")

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

const updateStatus = async (req, res) => {

    try {

        let quote = await Quotes.findById(req.params.id)

        if (!quote) {
            return res.status(404).json({ message: "Not Found" })
        } else {
            if (quote.user.toString() === req.user.id) {

                let status = ({
                    isActive: !quote.isActive
                })

                await Quotes.findByIdAndUpdate({ _id: req.params.id }, status)

                res.status(200).json({ message: "Status Updated" })

            } else {
                res.status(401).json({ message: "Action Not allowed" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteQuote = async (req, res) => {
    try {
        let quote = await Quotes.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote Not Found" })
        }
        if (quote.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Action Not Allowed' })
        }

        quote = await Quotes.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Quotes has Been Deleted" })
        sendNotification(req.user.id, ` Quotation "${quote.quote}" is Deleted`, "Delete", "Success")

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    fetchQuotes,
    postQuote,
    updateStatus,
    deleteQuote
}