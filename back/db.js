if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.secrets' });
}

const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost", // = 127.0.0.1
  port: 5441,
  database: "postgres",
});

async function query(req, params) {
  try {
    return await pool.query(req, params);
  } catch (err) {
    return err;
  }
}

module.exports = query;