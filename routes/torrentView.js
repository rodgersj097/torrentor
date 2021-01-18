var express = require('express');
var router = express.Router();
var webTorrent = require('webtorrent')
let fs = require("fs")
let path = require("path"); 
let client = require('../webTorrent/webTorrent')

let error_message = ""



client.on('error', function(err) {
	error_message = err.message;

});


/* GET users listing. */
router.get('/', function(req, res, next) {
   var data =  getTorrent()
   console.log(data)
    res.render('torrentView', {data:data} );
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
   var  stats = getTorrentProgress()
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


 getTorrentProgress = ()=>{ 
    let torrents = client.torrents.reduce(function(array, data) {
		array.push({
            hash: data.infoHash, 
            data: {
                name : data.name,
                progress: Math.round(data.progress * 100 * 100) / 100,
                timeRemaining: data.timeRemaining *60 *60,
                downloadSpeed: data.downloadSpeed,
                hash: data.infoHash
            }
        });
        return array;
    }, [])
    return torrents
};
getTorrent = ()=>{
    let torrents = client.torrents.reduce(function(array, data) {
		array.push({
            hash: data.infoHash,
            name: data.name
        });
        return array;
    }, [])
    return torrents
};
module.exports = router;
