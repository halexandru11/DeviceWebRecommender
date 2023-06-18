import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import querystring from 'querystring';
import { handleSignUpPost } from './endpoints/SignUp.js';
import { handleSignInPost } from './endpoints/SignIn.js';
import { handleFiltersRequest } from './endpoints/Filters.js';
import { verifyToken } from '../DeviceWebRecommender/verify-token.js'
dotenv.config();

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

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/auth/signup.html') {
    handleSignUpPost(req, res);
  }
  else if (req.method === 'POST' && req.url === '/auth/signin.html') {
    handleSignInPost(req, res);
  }
  else if (req.method === 'GET' && req.url === '/products/filter.html') {
    verifyToken(req, res, handleFiltersRequest);
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