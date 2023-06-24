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
import { insertWishlistProduct } from '../model/products.js';
import { getAllProducts, getProductSpecificationsById } from '../model/products.js';
import { generateProductCards } from './productView.js';
import { generateTableSpecifications, replaceProductDetailsTemplate } from './productDetailsView.js';
import { generateRSSFeed } from '../controller/RSSRecommend.js';
import { getTopProductsByReviews } from '../model/products.js';
import { generateRSSFeedPopular } from '../controller/RSSPopular.js';
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


export const productData = (await getAllProducts()).slice(0, 50);
const tempProductsOverview = fs.readFileSync('./view/templates/products.html', 'utf-8');
export const tempCard = fs.readFileSync('./view/templates/template-card.html', 'utf-8');
const tempProductDetails = fs.readFileSync('./view/templates/product-details.html', 'utf-8');
const tempSpecs = fs.readFileSync('./view/templates/template-table.html', 'utf-8');



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




async function handleViewRequest(req, res) {
  try {
    if (req.method === 'POST' && req.url === '/auth/signin.html') {
      handleSignInPost(req, res);
    }
    else if (req.method === 'POST' && req.url === '/auth/signup.html') {
      handleSignUpPost(req, res);
    }

    else if (req.method === 'POST' && req.url === '/auth/forgot-password.html') {
      handleForgotPassword(req, res);
    }

    else if (req.url === '/' || req.url === '/products/products.html') {

      // respondFile(req, res, 'products.html');
      const username = getusernameFromCookie(req, res);

      console.log(username);
      res.writeHead(200, { "Content-Type": "text/html" });
      const cardsHtml = await generateProductCards(productData, tempCard);
      const output = tempProductsOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
      res.end(output);


    } else if (req.url.match(/\/products\/product=[0-9]+/)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      const productId = req.url.split("=")[1];
      const product = await getProductSpecificationsById(productId);
      const tableHtml = await generateTableSpecifications(tempSpecs, product);
      let output = await replaceProductDetailsTemplate(tempProductDetails, productId);
      output = output.replace("{%PRODUCT_SPECIFICATIONS%}", tableHtml);
      res.end(output);
    }
    else if (req.method === 'POST' && req.url === '/products/product=[0-9]+') {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', async () => {
        const requestData = JSON.parse(data);
        console.log("Request data: ", requestData);

        const productId = requestData.character;
        const product = await getProductSpecificationsById(productId);
        const username = getusernameFromCookie(req, res);
        console.log(username);
        const productList = [product];

        if (username) {

          insertWishlistProduct(product, username)
            .then((result) => {
              console.log(result);
              // If the result is successful, grow the scores
              console.log('Growing scores...');
              return updateWishlistProductsScore(username, productList);
            })
            .then(() => {
              console.log('Scores grown successfully.');
              console.log(username);
              return getTopPicks(username); // this selects the top picks from the wishlist products
            })
            .then(async () => {
              console.log('Recommendations:');
              const recommendations = await searchTopProducts(username);
              // console.log(recommendations);

              const rssXml = generateRSSFeed(recommendations);
              //console.log(rssXml);
              const fileName = 'recommandations.xml';
              const filePath = path.join('./', fileName);
              fs.writeFile(filePath, rssXml, (err) => {
                if (err) {
                  res.write();
                  console.error('Error saving RSS feed:', err);
                } else {
                  console.log('RSS feed saved successfully!');
                }
              });

            });


        }
        else {
          res.write(404, JSON.stringify({ message: "You must be logged in to have this functionality!" }));
        }

      });
    }
    else if (req.url === "/recommandations.xml") { // not a object
      const username = getusernameFromCookie(req, res);
      if (username) {
        try {
          const data = fs.readFileSync('recommandations.xml', 'utf8');
          const modifiedData = data.replace(/<!\[CDATA\[/g, '').replace(/]]>/g, '');

          res.writeHead(200, { 'Content-Type': 'application/xml' });
          res.write(modifiedData);
          res.end();
        } catch (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      }

      else {
        res.write(404, JSON.stringify({ message: "You must be logged in to have this functionality!" }));
      }
    }
    else if (req.url === "/popular-products.xml") { // not a object
      const username = getusernameFromCookie(req, res);
      if (username) {
        try {
          const data = fs.readFileSync('popular-products.xml', 'utf8');
          const modifiedData = data.replace(/<!\[CDATA\[/g, '').replace(/]]>/g, '');

          res.writeHead(200, { 'Content-Type': 'application/xml' });
          res.write(modifiedData);
          res.end();
        } catch (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      }

      else {
        res.write(404, JSON.stringify({ message: "You must be logged in to have this functionality!" }));
      }
    }
    else if (req.url === "/products/product-details.js") {
      respondFile(req, res, "product-details.js");
    } else if (req.url === '/products/filter.html') {
      const username = getusernameFromCookie(req, res); // verifies token
      if (username) {
        respondFile(req, res, 'filter.html');
      }
      else {
        res.write(404, JSON.stringify({ message: "You must be logged in to have this functionality!" }));
      }
      //verifyToken(req, res, callbackFilters); //callbackFilters or whatever

    } else if (req.url === '/products/product-details.html') {
      respondFile(req, res, 'product-details.html');
    } else if (req.url === '/settings/choose-theme.html') {
      respondFile(req, res, 'choose-theme.html');
    } else if (req.url === '/info/about.html') {
      respondFile(req, res, 'about.html');
      insertProducts(products);
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
