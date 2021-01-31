const rp = require('request-promise')
const ch = require('cheerio')


exports.searchTorrent = (term) => {
    rp(`https://thepiratebay.org/search.php?q=${term}`)
        .then(function(html) {
            console.log(ch('.list-entry > .item-title > a'))
        })

}