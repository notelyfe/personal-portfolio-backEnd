const express = require('express');
const router = express.Router();
const getNowPlaying = require('../ThirdParty_API/SpotifyLib')

router.post('/getNowPlaying', async (req, res) =>{
    const nowPlaying = await getNowPlaying()
    res.json(nowPlaying)
})

module.exports = router;