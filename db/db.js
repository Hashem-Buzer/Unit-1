const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:5432/postgres"
});

module.exports = pool;
