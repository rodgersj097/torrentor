var express = require('express');
var router = express.Router();
var webTorrent = require('webtorrent')
let fs = require("fs")
let path = require("path");
let client = require('../webTorrent/webTorrent')
const torrentApi = require('../config/torrent')


function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/users/')
    }
}


/* GET users listing. */
router.get('/', loggedIn, function(req, res, next) {
    var data = torrentApi.getTorrent()
    console.log(data)
    res.render('torrentView', { data: data });
});

//
//	The API call that gets errors that occurred with the client
//
//	return 		<-	A a string with the error
//
router.get('/errors', loggedIn, function(req, res, next) {

    res.status(200);
    res.json(error_message);
    res.end()

});

router.get('/delete/:magnet', loggedIn, function(req, res, next) {

    //
    //	1.	Extract the magnet Hash and save it in a meaningful variable.
    //
    let magnet = req.params.magnet;

    //
    //	2.	Remove the Magnet Hash from the client.
    //
    client.remove(magnet, function() {

        res.status(200);
        res.end();

    });

});

module.exports = router;