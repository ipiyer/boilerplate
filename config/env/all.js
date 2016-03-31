"use strict";

const path = require("path");

const rootPath = path.normalize(__dirname + "./../../"),
  server = "http://localhost:5984",
  pgConnection = {
    host: 'localhost',
    user: 'prashanth',
    database: 'h1b',
    charset: 'utf8'
  },
  knex = require('knex')({
    client: 'pg',
    connection: pgConnection,
    debug: true,
    configDirectory: path.join(rootPath, "apps", "models", "schema_postgres"),
    directory: path.join(rootPath, "apps", "models", "schema_postgres")
  }),
  bookshelf = require('bookshelf')(knex);

module.exports = {
  root: rootPath,
  server: server,
  knex: knex,
  pgConnection: pgConnection,
  bookshelf: bookshelf
};
