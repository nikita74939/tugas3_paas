const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '34.172.113.167',
  user: 'admin',
  password: 'mypassword',   
  database: 'notes_123230044',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;