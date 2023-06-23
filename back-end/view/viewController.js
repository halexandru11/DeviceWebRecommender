import fs from 'fs';
import path from 'path';
import { handleSignInPost } from '../controller/sign-in-controller.js';
import { handleSignUpPost } from '../controller/sign-up-controller.js';
import { verifyToken } from '../controller/verifyToken.js';
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
import {
  getAllProducts,
  getProductSpecificationsById,
} from '../model/products.js';
import { generateProductCards } from './productView.js';
import {
  generateTableSpecifications,
  replaceProductDetailsTemplate,
} from './productDetailsView.js';
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

export const productData = await getAllProducts();
const tempProductsOverview = fs.readFileSync(
  './view/templates/products.html',
  'utf-8'
);
export const tempCard = fs.readFileSync(
  './view/templates/template-card.html',
  'utf-8'
);
const tempProductDetails = fs.readFileSync(
  './view/templates/product-details.html',
  'utf-8'
);
const tempSpecs = fs.readFileSync(
  './view/templates/template-table.html',
  'utf-8'
);

const similarProducts = [
  {
    name: 'Similar TV 1',
    price: 349.9,
    url: 'https://example.com/similar-tv-1',
    img: 'https://example.com/images/similar-tv-1.jpg',
    rating: 4.5,
    numReviews: 32,
  },
  {
    name: 'Similar TV 2',
    price: 379.9,
    url: 'https://example.com/similar-tv-2',
    img: 'https://example.com/images/similar-tv-2.jpg',
    rating: 4.8,
    numReviews: 58,
  },
  {
    name: 'Similar TV 3',
    price: 419.9,
    url: 'https://example.com/similar-tv-3',
    img: 'https://example.com/images/similar-tv-3.jpg',
    rating: 4.6,
    numReviews: 41,
  },
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
};

insertProducts(similarProducts)
  .then((result) => {
    console.log(result);
  })
  .then(async () => {
    console.log('Popular products:');
    const populars = await getTopProductsByReviews();
    // console.log(recommendations);

    const rssXml = generateRSSFeedPopular(populars);
    //console.log(rssXml);
    const fileName = 'popular-products.xml';
    const filePath = path.join('./', fileName);
    fs.writeFile(filePath, rssXml, (err) => {
      if (err) {
        res.write();
        console.error('Error saving RSS feed:', err);
      } else {
        console.log('RSS feed saved successfully!');
      }
    });
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

async function handleViewRequest(req, res) {
  try {
    if (req.method === 'POST' && req.url === '/auth/signin.html') {
      handleSignInPost(req, res);
    } else if (req.method === 'POST' && req.url === '/auth/signup.html') {
      handleSignUpPost(req, res);
    } else if (
      req.method === 'POST' &&
      (req.url === '/products/products.html' || req.url === '/')
    ) {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', async () => {
        const requestData = JSON.parse(data);

        if (requestData.type == 'json') {
          exportAsJson(res, productData.slice(0, 50));
        }
        if (requestData.type == 'csv') {
          exportAsCsv(res, productData.slice(0, 50));
        }
      });
    } else if (req.url === '/products/filter.html') {
      verifyToken(req, res, callbackFilters); //callbackFilters or whatever
      respondFile(req, res, 'filter.html');
    } else if (
      req.method === 'POST' &&
      req.url === '/auth/forgot-password.html'
    ) {
      handleForgotPassword(req, res);
    } else if (req.url === '/' || req.url === '/products/products.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const cardsHtml = await generateProductCards(productData, tempCard);
      const output = tempProductsOverview.replace(
        '{%PRODUCT_CARDS%}',
        cardsHtml
      );
      res.end(output);
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
    } else if (req.url === '/products/product-details.js') {
      respondFile(req, res, 'product-details.js');
    } else if (req.url === '/products/products.js' || req.url === '/') {
      respondFile(req, res, 'products.js');
    } else if (req.url.match(/\/products\/product=[0-9]+/)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const productId = req.url.split('=')[1];
      const product = await getProductSpecificationsById(productId);
      const tableHtml = await generateTableSpecifications(tempSpecs, product);
      let output = await replaceProductDetailsTemplate(
        tempProductDetails,
        productId
      );
      output = output.replace('{%PRODUCT_SPECIFICATIONS%}', tableHtml);
      res.end(output);
    } else if (
      req.method === 'POST' &&
      req.url === '/products/product=[0-9]+'
    ) {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
        console.log('am primit ceva\n');
      });

      req.on('end', async () => {
        const requestData = JSON.parse(data);
        console.log('Request data: ', requestData);

        const productId = requestData.character;
        const product = await getProductSpecificationsById(productId);
        const username = getusernameFromCookie(req, res); //WISHLIST STUFF!!!  SE EXECUTA DE 2 ORI (IDK WHY)
        console.log(username);
        insertWishlistProduct(product, username);
      });
    } else {
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
  } catch (err) {
    console.log(err);
  }
}

export default handleViewRequest;
