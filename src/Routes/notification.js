const express = require('express')
const router = express.Router()
var fetchuser = require('../MiddleWare/fetchuser')
const { getNotify, updateStatus, deleteNotifications } = require('../Controllers/notificationController')

// <--fetch notification using post method '/api/notification/getNotify'-->
router.post('/getNotify', getNotify)

// <--Edit read status using patch method '/api/notifications/status'-->
router.patch('/status', fetchuser, updateStatus)

// <--Delete Notification using delete method '/api/notifications/deleteNotify'-->
router.delete('/deleteNotify', fetchuser, deleteNotifications)

module.exports = router