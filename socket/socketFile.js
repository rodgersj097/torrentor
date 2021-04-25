const io = require("socket.io")();
const torrent = require('../config/torrent')
const search = require('../config/searchTorrents')
const socketapi = {
    io: io
};


function searchPromise(term){
    return new Promise((resolve)=>{
        resolve(search.searchTorrent(term))
    })
}

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

    socket.on('searchTorrent', async (data, callback) => {
        console.log(data)
        callback({
            data: await searchPromise(data)
        })
    })
});
// end of socket.io logic
module.exports = socketapi;