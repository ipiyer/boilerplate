'use strict';

var cluster = require('cluster'),
    express = require('express'),
    http = require("http"),
    os = require("os"),
    colors = require("colors");


var app = express();


console.log(colors.red("*********Node version******"), colors.red(process.version));

require('./config/express')(app);
var config = require('./config/config')

var numCPUs = require('os').cpus().length;
var port = parseInt(process.env.PORT, 10);

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server

    http.createServer(app).listen(port, function() {
        console.info('Express app started on port ' + colors.red(port));
    });
}

exports = module.exports = app;