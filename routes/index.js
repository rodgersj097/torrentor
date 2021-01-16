var express = require('express');
var router = express.Router();
var webTorrent = require('../torrent/torrent')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/getTorrents', function(req, res, next) {
    webTorrent(req.body.magnetLink)
    console.log('first')
    res.end();
})

module.exports = router;