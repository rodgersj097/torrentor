var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WebTorrent = require('webtorrent');
var socketapi = require("./socket/socketFile");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var torrentViewRouter = require('./routes/torrentView.js')
var seatchTorrentRouter = require('./routes/searchTorrents')
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const User = require('./model/user')
var app = express();

mongoose.connect(
    "mongodb+srv://rodgersAdmin:BZ4zF0U6WUAmi7by@cluster0.cp927.mongodb.net/torentor?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

var db = mongoose.connection;
db.on("error", err => console.log(err));
db.on("open", () => console.log("Connection to MongoDB"));
//add socket io to the res variable

app.use(
    session({
        secret: 'dffgjhsdfhawj234ywryhrghs',
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var client = new WebTorrent();
app.set('client', client)
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/viewTorrents', torrentViewRouter)
app.use('/searchTorrents', seatchTorrentRouter)
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = { app: app, socket: socketapi };