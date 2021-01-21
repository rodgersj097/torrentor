const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/user');

router.get('/', (req, res) => {
    res.render('login')
})
router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signin', function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            console.log(info)
            return res.json({ msg: '/users' })
        }
        req.logIn(user, function(err) {
            if (err) { return next(err) }
            return res.json({ route: '/' }) // res.redirect('/users' + user.username)
        })
    })(req, res, next)
})

router.post('/', (req, res, next) => {
    console.log('starting register')
    User.register(
        new User({ username: req.body.username, email: req.body.email }),
        req.body.pass,
        function(err, account) {
            if (err) {
                console.log(err)
                return res.json({ route: '/users/signup', msg: err.message })
            }

            passport.authenticate('local')(req, res, function() {
                res.json({ route: '/' })
            })
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})

module.exports = router;