require('dotenv').config();

const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = process.env.PORT || 8000 ;

app.use(express.json())  //middle ware to use req.body

app.use('/api/auth', require('./Routes/auth'))
// app.use('/api/project', require('./Routes/auth'))

app.listen(port, () => {
    console.log(`portfolio server is running on port ${port}`)
})

connectToMongo();