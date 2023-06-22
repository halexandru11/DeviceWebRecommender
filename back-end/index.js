import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mysql from 'mysql2';
import handleViewRequest from './view/viewController.js';

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
  })
  .promise();

const server = http.createServer((req, res) => {
  handleViewRequest(req, res);
});

const port = process.env.PORT || 3000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server running on port http://${host}:${port}`);
});
