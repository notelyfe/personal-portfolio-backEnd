require('dotenv').config();

const connectToMongo = require('./src/config/db');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000;

const whitelist = ['https://notelyfe.select']

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, origin)
        } else {
            callback(new Error("Not Allowed By Cors"));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.json())  //middle ware to use req.body

app.use('/api/auth', require('./src/Routes/auth'))
app.use('/api/projects', require('./src/Routes/project'))
app.use('/api/certificates', require('./src/Routes/certificates'))
app.use('/api/quotes', require('./src/Routes/quote'))
app.use('/api/resume', require('./src/Routes/resume'))
app.use('/api/spotify', require('./src/Routes/Spotify'))
app.use('/api/notifications', require('./src/Routes/notification'))

app.get('*', (req, res) => {
    res.status(404).json({ message: 'Page Not Found' })
})

app.listen(port, () => {
    console.log(`portfolio server is running on port ${port}`)
})

connectToMongo();