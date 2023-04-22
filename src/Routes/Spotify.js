const express = require('express');
const router = express.Router();
const getNowPlaying = require('../ThirdParty_API/SpotifyLib')

router.post('/getNowPlaying', async (req, res) => {

    try {
        const nowPlaying = await getNowPlaying()

        res.json(nowPlaying)
    } catch (error) {
        res.status(500).json({ message: "Spotify Server Error" })
    }
})

module.exports = router;