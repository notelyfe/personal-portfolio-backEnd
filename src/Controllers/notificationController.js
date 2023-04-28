const Notifications = require('../Models/Notification')

const sendNotification = async (user, msg, action, status) => {

    let notification_date = Date.now()

    let newNotification = new Notifications({
        user: user,
        notification_msg: msg,
        action: action,
        status: status,
        notification_date: notification_date,
        isReaded: false
    })

    await newNotification.save()

}

const getNotify = async (req, res) => {

    const notify = await Notifications.find().select("-user")
    res.json(notify)

}

const updateStatus = async (req, res) => {
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
}

const deleteNotifications = async (req, res) => {
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
}

module.exports = {
    sendNotification,
    getNotify,
    updateStatus,
    deleteNotifications
}