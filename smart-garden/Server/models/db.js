const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "smartlettuce",
});

module.exports = db;
