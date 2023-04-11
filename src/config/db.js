const mongoose = require('mongoose');

const mongoURI = process.env.mongouri

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("Connected to Mongo Success")
}

module.exports = connectToMongo;