const mongoose = require('mongoose')
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    notification_msg: {
        type: String,
    },
    action: {
        type: String
    },
    notification_date: {
        type: Date
    },
    isReaded: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model("notifications", NotificationSchema)