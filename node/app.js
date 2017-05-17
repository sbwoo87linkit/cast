'use strict';
/**
*   constant
*/
require('./global');

var config = global.config.was;
/**
*   load express & middleware & route modules
*/
var express = require('express');
var fs = require('fs');
var path = require('path');
var ejs = require('./to-jsp/ejs.js');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var routes = require('./routes/index');
var login = require('./routes/login');
var api = require('./routes/api');
var common = require('./routes/common');
var search = require('./routes/search');
var anomaly = require('./routes/anomaly');
var adv = require('./routes/adv');
var report = require('./routes/report');
var dataModel = require('./routes/data-model');
/**
*   configure express
*/
var app = express();

// view engine setup
app.engine('jsp', function(path, options, callback){
    fs.readFile(path, 'utf8', function (err, tmp) {
        if (err) {
            return callback(err);
        }
        callback(null, ejs.render(tmp, { filename: path }));
    });
});
app.set('view engine', 'jsp');
app.set('views', path.join(global.CLIENT_PATH, 'WEB-INF/views'));

app.use(favicon(path.join(global.CLIENT_PATH, 'resources/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    saveUninitialized: true,
    resave: true,
    rolling: true
    /*cookie:{maxAge : 3000000}*/
}));
app.use(express.static(path.join(global.CLIENT_PATH), { etag: true }));
// disable etag header
app.set('etag', false);
/**
*   register routes
*/
app.use('/', routes);
app.use('/login', login);
app.use('/api', api);

app.use('/common', common);

app.use('/search', search);
app.use('/ade', anomaly);
app.use('/adv', adv);

app.use('/report', report);
app.use('/datamodel', dataModel);

app.get('/views/*', function (req, res) {
    var renderPath = req.url.slice(0, req.url.length - 5);
    res.render(path.join(global.CLIENT_PATH, 'WEB-INF', renderPath));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
*   error handlers
*/
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
