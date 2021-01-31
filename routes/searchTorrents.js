var express = require('express');
var router = express.Router();
var searchTorrents = require('../config/searchTorrents')
function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/users/')
    }
}


/* GET users listing. */
router.get('/', loggedIn, function(req, res, next) {
    data = {}
    res.render('searchTorrents', data);
});


module.exports = router