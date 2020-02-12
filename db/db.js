const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgres://postgres:0000@localhost:2020/postgres"
});

module.exports = pool;
