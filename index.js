require('dotenv').config();

const connectToMongo = require('./src/Config/db');
const express = require('express')
const cors = require('cors')
const app = express()
const corsOptions = require('./src/Config/corsOptions')

const port = process.env.PORT || 8000;

// app.use(cors(corsOptions))
app.use(cors())

app.use(express.json())  //middle ware to use req.body

app.use('/api/auth', require('./src/Routes/auth'))
app.use('/api/projects', require('./src/Routes/project'))
app.use('/api/certificates', require('./src/Routes/certificates'))
app.use('/api/quotes', require('./src/Routes/quote'))
app.use('/api/resume', require('./src/Routes/resume'))
app.use('/api/spotify', require('./src/Routes/Spotify'))
app.use('/api/notifications', require('./src/Routes/notification'))

app.all('*', (req, res) => {
    res.status(404).json({ message: '404 Page Not Found' })
})

app.listen(port, () => {
    console.log(`portfolio server is running on port ${port}`)
})

connectToMongo();