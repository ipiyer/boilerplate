/* jslint node: true */
'use strict';

var _ = require('underscore'),
  path = require('path');

// Load app configuration

module.exports = _.extend(
  require(path.join(__dirname, 'env', 'all')),
  require(path.join(__dirname, 'env', (process.env.NODE_ENV ||
    "production"))));
