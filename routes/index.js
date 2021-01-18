var express = require('express');
var router = express.Router();

let fs = require("fs")
let path = require("path"); 
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Jacob Torrentor' });
});
let client = require('../webTorrent/webTorrent')



router.get('/getTorrents', async function(req, res, next) {

    let magnetLink = req.query.magnetLink;
    let files = [];
    await client.add(magnetLink,{path: 'C:\\Users\\LoneStar\\Documents\\torrentor\\torrents'}, function(torrent){
        torrent.files.forEach(function(data){
            files.push({
                name: data.name,
                length: data.length
            })
        })

     })

    res.status(200)
    res.json(files)
})




module.exports = router;