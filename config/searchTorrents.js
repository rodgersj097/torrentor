const torrentSearch = require('torrent-search-api')


exports.searchTorrent = async(term, category) => {
    console.time('start')
    torrentSearch.enablePublicProviders()
    var torrents = await torrentSearch.search(term, 'movies', 20)
    torrentsAll = []
    console.time('after get torrents')
    for (const tor of torrents) {
        const magnet = await torrentSearch.getMagnet(tor)
        console.time('get magnet')
        torrentsAll.push(`
        <tr><th scope="row"><span class="name mb-0 text-sm" id="name">${tor.title}</span></th><td class="budget" id="downloadSpeed">${tor.size}</td><td><span class="badge badge-dot mr-4">${tor.seeds} </span></td><td><div class="d-flex align-items-center"><span class="completion mr-2" id="progress"></span><div><a class="btn btn-sm btn-primary download"  data-magnet="${magnet}">Download</a></div></div></td></tr>`)
    };
    console.time('end')
    return torrentsAll
}