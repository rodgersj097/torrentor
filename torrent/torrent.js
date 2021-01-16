var WebTorrent = require('webtorrent')

var getTorrent = (magnetLink) => {
    var client = new WebTorrent();
    client.add(magnetLink, { path: './downloads' }, function(torrent) {

        torrent.on('done', () => {
            console.log('done torrent')
        })
        torrent.on('error', (e) => {
            console.log(e)
        })


    })

}

module.exports = getTorrent;