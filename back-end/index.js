import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mysql from 'mysql2';
import handleViewRequest from './view/viewController.js';
import handleApiRequest from './api/controller.js';

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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  console.log('Request received: ', req.url);
  const url = req.url;
  if (url.startsWith('/api')) {
    handleApiRequest(req, res);
  } else {
    handleViewRequest(req, res);
  }
});

const port = process.env.PORT || 3000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server running on port http://${host}:${port}`);
});
