var express = require('express');
var router = express.Router();
var searchTorrents = require('../config/searchTorrents')
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


/* GET users listing. */
router.get('/', loggedInAndTorrent, function(req, res, next) {
    data = {}
    res.render('searchTorrents', data);
});


module.exports = router