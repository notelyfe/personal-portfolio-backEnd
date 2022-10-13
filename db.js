const mongoose = require('mongoose');

const mongoURI = process.env.mongouri

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo success")
    })
}

module.exports = connectToMongo;