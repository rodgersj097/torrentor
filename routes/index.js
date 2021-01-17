var express = require('express');
var router = express.Router();
var webTorrent = require('webtorrent')
let fs = require("fs")
let path = require("path"); 
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
let client = new webTorrent();

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
        stats = {
            progress: Math.round(client.progress * 100 * 100) / 100,
            downloadSpeed: client.downloadSpeed,
            ratio: client.ratio
        }
})

router.get('/getTorrents', function(req, res, next) {
    res.end()
    let magnetLink = req.query.magnetLink;

    client.add(magnetLink, function(torrent){
        let files = [];

        torrent.files.forEach(function(data){
            data.path = "/"
            files.push({
                name: data.name,
                length: data.length
            })
        })

        
    })
    res.status(200)
        res.json(files)
        res.end()

})

router.get('/list', function(req, res, next) {

	//
	//	1.	Loop over all the Magnet Hashes
	//
	let torrent = client.torrents.reduce(function(array, data) {
        console.log(data)
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
module.exports = router;