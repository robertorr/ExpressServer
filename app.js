var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

// Tweet Counter
var tweetCounter = require('./public/Twitter/tweet_counter.js');
var tweetTerms = ['awesome', 'cool', 'rad', 'groovy', 'fleek', 'trump'];
var tweetCounts = tweetCounter(tweetTerms);
var startDatetime = (new Date).getTime();

// Amazeriffic
var todos = require('./public/Amazeriffic/todos_file.json');

// app creation and setup
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

///////////////////
// SET UP ROUTES //
///////////////////

// standard static route
app.use(express.static(path.join(__dirname, 'public')));

// basic routes
app.use('/', index);
app.use('/index', index);
app.use('/users', users);
app.use('/hello', function (req, res) {
    res.send("Hello World!");
});
app.use('/goodbye', function (req, res) {
    res.send("Goodbye!!");
});

// Tweet Counter routes
app.use('/starttime.json', function(req, res) {
    "use strict";
    res.json({starttime: startDatetime});
});

app.use('/counts.json', function (req, res) {
    "use strict";
    res.json(tweetCounts);
});

// Amazeriffic routes
app.use('/todos.json', function (req, res) {
    "use strict";
    res.json(todos);
});

app.post('/todos', function (req, res) {
    "use strict";
    console.log("todo data posted to the server");
    var newTodo = req.body;
    console.log(newTodo);
    todos.push(newTodo);
    res.json({message: "post received"});
});

// ERROR HANDLERS
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
