// Update with your config settings.
const config = require("../../../config/config");


const path = require("path");

module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: config.pgConnection,
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  test: {
    client: 'pg',
    debug: true,
    connection: config.pgConnection,
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
