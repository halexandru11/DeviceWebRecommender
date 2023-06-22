import fs from 'fs';
import path from 'path';
import { handleSignInPost } from '../controller/sign-in-controller.js';
import { handleSignUpPost } from '../controller/sign-up-controller.js';
import { verifyToken } from '../controller/verifyToken.js'
import { handleForgotPassword } from '../controller/forgot-your-password.js';
import { callbackFilters } from '../controller/callbackFilters.js';
import { logSimilarProducts } from '../model/insert_scraped_data.js';
import { insertProducts } from '../model/products.js';
import { insertVendors } from '../model/vendors.js';
import { insertProductImages } from '../model/productImages.js';
import { insertDeviceTypes } from '../model/deviceTypes.js';
import { insertWishlistProducts } from '../model/products.js';
import { getusernameFromCookie } from '../controller/getUsernameFromCookie.js';
import { insertWishlistProductsIfNotExist } from '../model/products.js';
import { updateWishlistProductsScore } from '../model/products.js';
import { getTopPicks } from '../model/products.js';
import { searchTopProducts } from '../model/products.js';
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


const similarProducts = [
  {
    name: 'Similar TV 1',
    price: 349.9,
    url: 'https://example.com/similar-tv-1',
    img: 'https://example.com/images/similar-tv-1.jpg',
    rating: 4.5,
    numReviews: 32
  },
  {
    name: 'Similar TV 2',
    price: 379.9,
    url: 'https://example.com/similar-tv-2',
    img: 'https://example.com/images/similar-tv-2.jpg',
    rating: 4.8,
    numReviews: 58
  },
  {
    name: 'Similar TV 3',
    price: 419.9,
    url: 'https://example.com/similar-tv-3',
    img: 'https://example.com/images/similar-tv-3.jpg',
    rating: 4.6,
    numReviews: 41
  }
];


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


insertProducts(similarProducts)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
insertVendors(similarProducts)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

insertProductImages(similarProducts)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
insertDeviceTypes(similarProducts)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });


const handleViewRequest = (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/auth/signin.html') {
      handleSignInPost(req, res);
    }
    else if (req.method === 'POST' && req.url === '/auth/signup.html') {
      handleSignUpPost(req, res);
    }
    else if (req.url === '/products/filter.html') {
      verifyToken(req, res, callbackFilters); //callbackFilters or whatever
    }
    else if (req.method === 'POST' && req.url === '/auth/forgot-password.html') {
      handleForgotPassword(req, res);
    }
    else if (req.url === '/') {
      respondFile(req, res, 'products.html');
    } else if (req.url === '/products/products.html') {
      const username = getusernameFromCookie(req, res); //WISHLIST STUFF!!!  SE EXECUTA DE 2 ORI (IDK WHY)
      console.log(username);
      /*if (username) {
        insertWishlistProductsIfNotExist(similarProducts, username)
          .then((result) => {
            console.log(result);
            // If the result is successful, grow the scores
            console.log('Growing scores...');
            return updateWishlistProductsScore(username, similarProducts);
          })
          .then(() => {
            console.log('Scores grown successfully.');
            return getTopPicks(username); // this selects the top picks from the wishlist products

          })
          .then(() => {
            console.log('Recommandations:');
            return searchTopProducts(username);

          })
          .catch((error) => {
            if (error instanceof TypeError && error.message.includes("Cannot read properties of null (reading 'url')")) {
              console.error('Error inserting products:', error);
              console.log('Calling insertWishlistProducts...');
              return insertWishlistProducts(similarProducts, username)
                .then(() => {
                  console.log('Products inserted successfully.');
                  console.log('Growing scores...');
                  return updateWishlistProductsScore(username, similarProducts);
                })
                .then(() => {
                  console.log('Scores grown successfully.');
                });
            } else {
              console.error(error);
            }
          });

      }*/
      respondFile(req, res, 'products.html');

    } else if (req.url === '/products/filter.html') {
      verifyToken(req, res, callbackFilters); //callbackFilters or whatever
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
  catch (err) {
    console.log("Error ", err);
  }
}



export default handleViewRequest;
