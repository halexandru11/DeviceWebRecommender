import { getAllProducts, insertProducts } from '../model/products.js';
import { getProductImageUrlByProductId } from '../model/productImages.js';
import { getusernameFromCookie } from '../controller/getUsernameFromCookie.js';

async function getFilteredProductsApi(req, res) {
  try {
    const url = req.url;
    const filtersString = url.split('=')[1];
    const filters = filtersString
      .split(',')
      .map((filter) => filter.trim().toLowerCase());
    console.log('filters: ', filters);

    const allProducts = await getAllProducts();

    let products = [];

    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      for (let filter of filters) {
        console.log('filter: ', filter);
        if (product.name.toLowerCase().includes(filter)) {
          products.push(product);
          break;
        }
        if (
          filter === 'emag' ||
          filter === 'altex' ||
          filter === 'flanco' ||
          filter === 'mediagalaxy'
        ) {
          if (product.vendor_name.toLowerCase() === filter) {
            products.push(product);
            break;
          }
        }
      }
    }

    products = products.slice(0, 100);

    for (let i = 0; i < products.length; i++) {
      const image = await getProductImageUrlByProductId(products[i].id);
      products[i].image = image;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ products }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}

async function getRecommendedProductsApi(req, res) {
  try {
    // const username = getusernameFromCookie();
    // console.log('username: ', username);
    // let products = await searchTopProducts(username);

    const products = (await getAllProducts()).slice(0, 100);
    for (let i = 0; i < products.length; i++) {
      const image = await getProductImageUrlByProductId(products[i].id);
      products[i].image = image;
    }

    console.log('products: ', products);
    res.statusCode = 200;
    res.end(JSON.stringify({ products }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}

async function getBody(req) {
  return await new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

async function addProductApi(req, res) {
  try {
    const product = await getBody(req);
    console.log('product: ', product);
    await insertProducts([product]);
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Product inserted' }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}

export async function productController(req, res) {
  const url = req.url;
  const method = req.method;
  console.log('url: ', url);

  if (method == 'GET' && url === '/api/products') {
    await getRecommendedProductsApi(req, res);
  } else if (method == 'POST' && url === '/api/products') {
    await addProductApi(req, res);
  } else if (method == 'GET' && url.startsWith('/api/products/filter=')) {
    await getFilteredProductsApi(req, res);
  }
}
