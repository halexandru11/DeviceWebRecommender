import fs from 'fs';
import path from 'path';
import { handleSignInPost } from '../controller/sign-in-controller.js';
//import { handleSignUpPost } from '../controller/sign-up-controller.js';
const mimeLookup = {
  '.js': 'application/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.gif': 'image/gif',
};

const respondFile = (req, res, filePath) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile(`./view/templates/${filePath}`, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    } else {
      res.end(data);
    }
  });
}

const handleViewRequest = (req, res) => {
  if (req.method === 'POST' && req.url === '/auth/signin.html') {
    handleSignInPost(req, res);
  }
  else if (req.method === 'POST' && req.url === '/auth/signup.html') {
    //handleSignUpPost(req, res);
  }
  else if (req.url === '/') {
    respondFile(req, res, 'products.html');
  } else if (req.url === '/products/products.html') {
    respondFile(req, res, 'products.html');
  } else if (req.url === '/products/filter.html') {
    respondFile(req, res, 'filter.html');
  } else if (req.url === '/products/product-details.html') {
    respondFile(req, res, 'product-details.html');
  } else if (req.url === '/settings/choose-theme.html') {
    respondFile(req, res, 'choose-theme.html');
  } else if (req.url === '/info/about.html') {
    respondFile(req, res, 'about.html');
  } else if (req.url === '/info/help.html') {
    respondFile(req, res, 'help.html');
  } else if (req.url === '/auth/signin.html') {
    respondFile(req, res, 'signin.html');
  } else if (req.url === '/auth/signup.html') {
    respondFile(req, res, 'signup.html');
  } else if (req.url === '/auth/forgot-password.html') {
    respondFile(req, res, 'forgot-password.html');
  }


  else {
    const fileUrl = '/public' + req.url;
    const filePath = path.resolve('.' + fileUrl);
    const fileExt = path.extname(filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 Not Found');
      } else {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end('500 Internal Server Error');
          } else {
            res.statusCode = 200;
            res.end(data);
          }
        });
      }
    });
  }
}



export default handleViewRequest;
