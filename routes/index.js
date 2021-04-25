var express = require('express');
var router = express.Router();

let fs = require("fs")
let path = require("path");


function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/users/')
    }
}

function loggedInAndTorrent(req, res, next) {
    if (req.user) {
        if (req.user.canTorrent == 1) {
            next()
        } else {
            res.json({ msg: 'Woah!!!! cool your boots. You need approval for this. Contact Jacob if he forgot to approve you or if your new.', status: 'error' })
        }
    } else {
        res.redirect('/users/')
    }
}
/* GET home page. */
router.get('/', loggedIn, function(req, res, next) {
    res.render('index', { title: 'Jacob Torrentor' });
});
let client = require('../webTorrent/webTorrent')



router.get('/getTorrents', loggedInAndTorrent, async function(req, res, next) {

    let magnetLink = req.query.magnetLink;
    let files = [];
    await client.add(magnetLink, { path: '/opts/plexmedia/' }, function(torrent) {
        torrent.files.forEach(function(data) {
            files.push({
                name: data.name,
                length: data.length
            })
        })

    })

    res.status(200)
    res.json({ msg: 'Downloading Torrent. Go check the "View Torrents" tabs for updates. Then look in plex to play your movie!', status: 'success' })
})




module.exports = router;