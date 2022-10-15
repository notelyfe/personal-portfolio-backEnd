require('dotenv').config();

const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 8000 ;

app.use(cors())

app.use(express.json())  //middle ware to use req.body

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/projects', require('./Routes/project'))
app.use('/api/certificates', require('./Routes/certificates'))
app.use('/api/quotes', require('./Routes/quote'))
app.use('/api/resume', require('./Routes/resume'))

app.listen(port, () => {
    console.log(`portfolio server is running on port ${port}`)
})

connectToMongo();