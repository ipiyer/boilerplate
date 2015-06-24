'use strict'

var logger = require("morgan"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require("path"),
    express = require("express");

var routes = require("../apps/routes/all"),
    config = require("./env/all"),
    Handlebars = require("handlebars");



module.exports = function(app) {
    app.set('views', path.join(config.root, 'apps', 'views'));
    app.set('view engine', 'hbs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    var Hbsc = require("express-hbsc")(app, Handlebars);

    app.engine('hbs', function(view, context, cb) {
        Hbsc.render(view, context, cb);
    });

    // init routes; routes should be above 404;
    require("../apps/routes/all")(app);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('500', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('500', {
            message: err.message,
            error: {}
        });
    });

    return app;
}