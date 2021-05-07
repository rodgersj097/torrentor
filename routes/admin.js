var express = require('express');
const { route } = require('.');
var router = express.Router();


module.exports = router;

function isLoggedInandAdmin(req, res, next) {
    if (req.user) {
        if (req.user.isAdmin) {
            next()
        } else {
            res.redirect('/viewTorents')
        }
    } else {
        res.redirect('/users/')
    }
}

router.get('/', isLoggedInandAdmin, (res, req, next) => {

    res.render('admin', { title: "Jacobs Torrentor" });
})