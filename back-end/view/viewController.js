import fs from 'fs';
import path from 'path';
import { getAllProducts } from '../model/products.js';
import { getProductImageUrlByProductId } from '../model/productImages.js';
import { getProductSpecificationsById } from '../model/products.js';
import { generateTableSpecifications, replaceProductDetailsTemplate} from './productDetailsView.js';
import { generateProductCards } from './productView.js';


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
const tempProductsOverview = fs.readFileSync('./view/templates/products.html', 'utf-8');
export const tempCard = fs.readFileSync('./view/templates/template-card.html', 'utf-8');
const tempProductDetails = fs.readFileSync('./view/templates/product-details.html', 'utf-8');
const tempSpecs = fs.readFileSync('./view/templates/template-table.html', 'utf-8');

const respondFile = (req, res, filePath) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile(`./view/templates/${filePath}`, (err, data) => {
      if(err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
      } else {
          res.end(data);
      }
  });
}
async function handleViewRequest(req, res) {
  if (req.url === "/" || req.url === "/products/products.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHtml = await generateProductCards(productData, tempCard);
    const output = tempProductsOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (req.url === "/products/filter.html") {
    respondFile(req, res, "filter.html");
  } else if (req.url === "/products/product-details.html") {
    respondFile(req, res, "product-details.html");
  } else if (req.url === "/settings/choose-theme.html") {
    respondFile(req, res, "choose-theme.html");
  } else if (req.url === "/info/about.html") {
    respondFile(req, res, "about.html");
  } else if (req.url === "/info/help.html") {
    respondFile(req, res, "help.html");
  } else if (req.url === "/auth/signin.html") {
    respondFile(req, res, "signin.html");
  } else if (req.url === "/auth/signup.html") {
    respondFile(req, res, "signup.html");
  } else if (req.url === "/auth/forgot-password.html") {
    respondFile(req, res, "forgot-password.html");
  }  else if (req.url.match(/\/products\/product=[0-9]+/)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    const productId = req.url.split("=")[1];
    const product = await getProductSpecificationsById(productId);
    const tableHtml = await generateTableSpecifications(tempSpecs, product);
    let output = await replaceProductDetailsTemplate(tempProductDetails, productId);
    output = output.replace("{%PRODUCT_SPECIFICATIONS%}", tableHtml);
    res.end(output);
    // const specifications = await getProductSpecificationsById(productId);
    // console.log(specifications)
    // const tableSpecifications = await generateTableSpecifications(tempProductDetails, specifications);
    // res.writeHead(200, { "Content-Type": "text/html" });
    // const output = await replaceProductDetailsTemplate(tempProductDetails, productId);
    // output = output.replace("{%PRODUCT_SPECIFICATIONS%}", tableSpecifications);
    // res.end(output);
  } else {
    const fileUrl = "/public" + req.url;
    const filePath = path.resolve("." + fileUrl);
    const fileExt = path.extname(filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.statusCode = 404;
        res.end("404 Not Found");
      } else {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end("500 Internal Server Error");
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
