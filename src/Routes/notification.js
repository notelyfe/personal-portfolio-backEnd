const express = require('express')
const router = express.Router()
const Notifications = require('../Models/Notification')
var fetchuser = require('../MiddleWare/fetchuser')

// <--fetch notification using post method '/api/notification/getNotify'-->
router.post('/getNotify', async (req, res) => {

    const notify = await Notifications.find().select("-user")
    res.json(notify)

})

// <--Edit read status using patch method '/api/notifications/status'-->
router.patch('/status', fetchuser, async (req, res) => {
    try {

        let ids = req.body.ids
        let success = []

        for (let i = 0; i < ids.length; i++) {

            let notify = await Notifications.findById(ids[i])

            if ((notify.user.toString() === req.user.id) && (notify.isReaded === false)) {

                let status = ({
                    isReaded: true
                })

                await Notifications.findByIdAndUpdate({ _id: ids[i] }, status)
                success.push(true)

            } else {
                success.push(false)
            }
        }

        if (success.includes(false)) {

            res.status(401).json({ message: "Action Not Allowed or notification already readed" })

        } else {
            res.status(200).json({ message: "Notifications Readed" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// <--Delete Notification using delete method '/api/notifications/deleteNotify'-->
router.delete('/deleteNotify', fetchuser, async (req, res) => {
    try {

        let ids = req.body.ids

        let success = []

        for (let i = 0; i < ids.length; i++) {

            let notify = await Notifications.findById(ids[i])

            if (notify.user.toString() === req.user.id) {

                await Notifications.findByIdAndDelete({ _id: ids[i] })

                success.push(true)

            } else {
                success.push(false)
            }

        }

        if (success.includes(false)) {
            res.status(401).json({ message: "Action Not Allowed" })
        } else {
            res.status(200).json({ message: "Notifications Deleted" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router