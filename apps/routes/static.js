/* jslint node:true */
"use strict";


var express = require("express"),
    path = require("path"),
    config = require('../../config/config');


module.exports = function(router) {
    router.get(/^\/js/, express.static(path.join(config.root, 'public', 'js')));
    router.get(/^\/css/, express.static(path.join(config.root, 'public', 'css')));
    router.get(/^\/img/, express.static(path.join(config.root, 'public', 'img')));
    router.get(/^\/fonts/, express.static(path.join(config.root, 'public', 'fonts')));

    router.get('/robots.txt', express.static(path.join(config.root, 'public')));

    return router;

}