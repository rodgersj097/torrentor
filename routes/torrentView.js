var express = require('express');
var router = express.Router();
var webTorrent = require('webtorrent')
let fs = require("fs")
let path = require("path"); 
let client = require('../webTorrent/webTorrent')

let stats = {
    progress : 0,
    downloadspeed: 0,
    ratio: 0
}
let error_message = ""



client.on('error', function(err) {
	error_message = err.message;

});

client.on('download', function(bytes){
getTorrentProgress()
    
        stats = {
            progress: Math.round(client.progress * 100 * 100) / 100,
            downloadSpeed: client.downloadSpeed,
            ratio: client.ratio
        }
})
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('torrentView',);
});

router.get('/list', function(req, res, next) {

	//
	//	1.	Loop over all the Magnet Hashes
	//
	let torrent = client.torrents.reduce(function(array, data) {
		array.push({
			hash: data.infoHash
		});

		return array;

	}, []);

	//
	//	->	Return the Magnet Hashes
	//
	res.status(200);
    res.json(torrent);
    res.end()

});

router.get('/stats', function(req, res, next) {

	res.status(200);
    res.json(stats);
    res.end()

});

//
//	The API call that gets errors that occurred with the client
//
//	return 		<-	A a string with the error
//
router.get('/errors', function(req, res, next) {

	res.status(200);
    res.json(error_message);
    res.end()

});

//
router.get('/delete/:magnet', function(req, res, next) {

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


function getTorrentProgress (){ 

    let torrents = client.torrents.reduce(function(array, data) {
		array.push({
			torrent: data
		});

		return array;

    }, []);
    var AllTorrentProgress = [] 
    torrents.forEach(torrent => {
       var torrentProgress = {
           progress: torrent.progress , 
           timeRemaining : torrent.timeRemaining, 
           name: torrent.name


       }
       AllTorrentProgress.push(torrentProgress)
    });
    console.log(AllTorrentProgress)
}

module.exports = router;
