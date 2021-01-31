var express = require('express');
var router = express.Router();

function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/users/')
    }
}


/* GET users listing. */
router.get('/', loggedIn, function(req, res, next) {
    res.render('searchTorrent');
});

module.exports = router