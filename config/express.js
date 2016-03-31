'use strict'

var logger = require("morgan"),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require("path"),
  express = require("express"),
  Handlebars = require("handlebars"),
  Promise = require("bluebird");

var routes = require("../apps/routes/all"),
  config = require("./config");

module.exports = function(app) {
  app.set("showStackError", true);
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

  // app.use(express.static(path.join(config.root, 'public')));
  Handlebars.debug = true;

  var Hbsc = require("express-hbsc")(app, Handlebars);

  app.engine('hbs', function(view, context, cb) {
    Hbsc.render(view, context, cb);
  });

  // set user details to local
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });


  // init routes; routes should be above 404;
  require("../apps/routes/all")(app);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    return res.status(404).render("404", {
      url: req.originalUrl,
      error: 'Not Found'
    });
  });


  // error handlers

  app.use(function(err, req, res, next) {
    if (err.code == 'EBADCSRFTOKEN') {
      return res.status(403).json({
        error: "Invalid csrf Token"
      });
    }
    return next(err)
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);

      console.log(err.stack);

      res.render('500', {
        message: err.stack,
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
