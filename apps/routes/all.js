'use strict';

var express = require("express");
var router = express.Router();

var test = require("./test");

module.exports = function(app) {
    app.use("", test(router));
    return app;
}