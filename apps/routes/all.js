'use strict';

var express = require("express");
var router = express.Router();

var test = require("./test"),
    staticPath = require("./static");

module.exports = function(app) {
    app.use("", test(router));
    app.use("", staticPath(router));
    return app;
}