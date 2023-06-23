import { getProductImageUrlByProductId } from '../model/productImages.js';
import { productData } from './viewController.js';
import fs from 'fs';

async function replaceProductsTemplate(temp, product) {
  const photoUrl = await getProductImageUrlByProductId(product.id);
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.name);
  output = output.replace(/{%IMAGE_SRC%}/g, photoUrl);
  output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCT_ID%}/g, product.id);
  return output;
}

export async function generateProductCards(data, tempCard) {
  const products = productData.slice(0, 50);
  const promises = products.map((el) => replaceProductsTemplate(tempCard, el));
  const resolvedPromises = await Promise.all(promises);
  const cardsHtml = resolvedPromises.join('');
  return cardsHtml;
}

function downloadFile(response, filename, fileContent) {
  fs.writeFile(filename, fileContent, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File written successfully');

    const fileStream = fs.createReadStream(filename);
    const stat = fs.statSync(filename);

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename=${filename}`,
    };

    response.writeHead(200, headers);
    fileStream.pipe(response);
  });
}

export function exportAsJson(response, products) {
  const filename = 'products.json';
  const fileContent = JSON.stringify(products);
  console.log('downloading file');
  downloadFile(response, filename, fileContent);
}

function convertToCsv(products) {
  const headers = Object.keys(products[0]).join(',');
  const rows = products.map((product) => Object.values(product).join(','));
  return headers + '\n' + rows.join('\n');
}

export function exportAsCsv(response, products) {
  const filename = 'products.csv';
  const fileContent = convertToCsv(products);
  console.log('creating csv');
  downloadFile(response, filename, fileContent);
}
