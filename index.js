import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import querystring from 'querystring';
import { sendConfirmationEmail } from './emailService.js';
import {testProductsTable} from './entity/productsEntity.js';
import {testDeviceTypesTable} from './entity/deviceTypesEntity.js';
import {testPasswordsTable} from './entity/passwordsEntity.js';
import {testProductImagesTable} from './entity/productImagesEntity.js';
import { testUsersTable } from './entity/usersEntity.js';
import { testVendorsTable } from './entity/vendorsEntity.js';
import { testWishlistProductsTable } from './entity/wishlistProductsEntity.js';
import { test } from 'node:test';

dotenv.config();
//testProductsTable();
//testDeviceTypesTable();
//testPasswordsTable();
//testProductImagesTable();
//testUsersTable();
//testVendorsTable();
testWishlistProductsTable();

const getContentType = (extname) => {
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  return contentType;
}


//refactor code 
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/auth/signup.html') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let values = querystring.parse(body);
      console.log(values);
      console.log(body);
      const email = values.email;
      const username = values.username;
      //rewrite this part
      res.writeHead(302, { 'Location': '../pages/products/products.html' });
      sendConfirmationEmail(email, username);
      res.end();
    });

  }

  let filePath = `.${req.url}`;
  if (req.url === '/') {
    filePath = './pages/products/products.html';
  }
  else if (req.url === '/products/products.html') {
    filePath = './pages/products/products.html';
  }
  else if (req.url === '/products/filter.html') {
    filePath = './pages/products/filter.html';
  }
  else if (req.url === '/products/product-details.html') {
    filePath = './pages/products/product-details.html';
  }
  else if (req.url === '/settings/choose-theme.html') {
    filePath = './pages/settings/choose-theme.html';
  }
  else if (req.url === '/info/about.html') {
    filePath = './pages/info/about.html';
  }
  else if (req.url === '/info/help.html') {
    filePath = './pages/info/help.html';
  }
  else if (req.url === '/auth/signin.html') {
    filePath = './pages/auth/signin.html';
  }
  else if (req.url === '/auth/signup.html') {
    filePath = './pages/auth/signup.html';
  }
  else if (req.url === '/auth/forgot-password.html') {
    filePath = './pages/auth/forgot-password.html';
  }

  const extname = path.extname(filePath);
  const contentType = getContentType(extname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('Error: Not found!');
    } else {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.write(data);
    }
    res.end();
  });

});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
