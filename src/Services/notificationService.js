const Notification = require('../Models/Notification')

const sendNotification = async (user, msg, action, status) => {

    let notification_date = Date.now()

    let newNotification = new Notification({
        user: user,
        notification_msg: msg,
        action: action,
        status: status,
        notification_date: notification_date,
        isReaded: false
    })

    await newNotification.save()

}

module.exports = {
    sendNotification
}