const io = require("socket.io")();
const torrent = require('../config/torrent')
const search = require('../config/searchTorrents')
const socketapi = {
    io: io
};




// Add your socket.io logic here!
io.on("connection", function(socket) {
    console.log("A user connected");
    socket.on('getStats', (callback) => {
        callback({
            obj: torrent.getTorrentProgress()
        })
    })

    socket.on('error', (callback) => {
        callback({
            error_message: torrent.getErrors()
        })
    })

    socket.on('searchTorrent', (callback, term) => {
        callback({
            data: search.searchTorrent(term)
        })
    })
});
// end of socket.io logic

module.exports = socketapi;