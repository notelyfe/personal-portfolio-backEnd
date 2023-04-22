const express = require('express');
const router = express.Router();
const getNowPlaying = require('../ThirdParty_API/SpotifyLib')

router.post('/getNowPlaying', async (req, res) => {

    try {
        const nowPlaying = await getNowPlaying()

        res.json(nowPlaying)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router;