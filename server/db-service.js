const mysql = require('mysql2');
const dotenv = require('dotenv').config({path: '../.env'});
// dotenv.config();

const connection = mysql.createPool({
  user: 'root',
  host: '127.0.0.1',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 3306
  // ssl : {
  //   ca : fs.readFileSync(__dirname + '/../db_files/ca.pem')
  // }
});

module.exports = connection;

