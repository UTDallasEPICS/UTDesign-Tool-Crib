const mysql = require('mysql');
const dotenv = require('dotenv').config({path: '../.env'});

// dotenv.config();

const connection = mysql.createPool({
  user: 'root',
  host: 'localhost',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = connection;

