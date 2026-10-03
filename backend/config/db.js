// import sql2 a library to connect node.js with mysql
// promise is used to prevent callback hell
const mysql = require("mysql2/promise");

// load environment variables from .env
require("dotenv").config();

// This creates a pool of reusable DB connections.
// Why connection pooling?
// Connection pooling improves performance by reusing database connections instead of opening a new one for every request.
const pool = mysql.createPool({
  host: process.env.DB_HOST, // mostly localhost
  user: process.env.DB_USER, // root user
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Which database to connect.
  waitForConnections: true, // if all connections busy then wait instead of crashing
  connectionLimit: 10, // limit 10 , if 11 request comes then wait
  queueLimit: 0, // unlimited queue, if 20 requests 10 active then keep waiting
});

// Export pool for use in controllers
module.exports = pool;
