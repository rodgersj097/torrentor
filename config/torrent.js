let client = require('../webTorrent/webTorrent')
let error_message = ""
client.on('error', function(err) {
    error_message = err.message;

});
exports.getTorrentProgress = () => {
    let torrents = client.torrents.reduce(function(array, data) {
        var progress = Math.round(data.progress * 100 * 100) / 100
        if (progress !== 100) {
            array.push({
                hash: data.infoHash,
                data: {
                    name: data.name,
                    progress: progress,
                    timeRemaining: data.timeRemaining,
                    maxPeers: data.numPeers,
                    downloadSpeed: data.downloadSpeed,
                    hash: data.infoHash
                }
            });
        }
        return array;
    }, [])
    return torrents
};
exports.getTorrent = () => {
    let torrents = client.torrents.reduce(function(array, data) {
        array.push({
            hash: data.infoHash,
            name: data.name
        });
        return array;
    }, [])
    return torrents
};


exports.getErrors = () => {
    return error_message

}