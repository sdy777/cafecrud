
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "본인_SQL_비밀번호",
  database: "cafe_db",
  connectionLimit: 5,
});

module.exports = pool;
