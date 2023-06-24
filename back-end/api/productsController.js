import { getAllProducts } from '../model/products.js';
import { getProductImageUrlByProductId } from '../model/productImages.js';

async function getFilteredProductsApi(req, res) {
  try {
    const url = req.url;
    const filtersString = url.split('=')[1];
    const filters = filtersString.split(',');

    let products = await getAllProducts();

    products = products.filter((product) => {
      for (let filter in filters) {
        if (product.name.toLowerCase().includes(filter.toLowerCase())) {
          return true;
        }
      }
      return false;
    });

    for (let i = 0; i < products.length; i++) {
      const image = await getProductImageUrlByProductId(products[i].id);
      products[i].image = image;
    }
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

export async function productController(req, res) {
  const url = req.url;
  const method = req.method;
  console.log('url: ', url);

  if (method == 'GET' && url === '/api/products') {
    await getRecommendedProductsApi(req, res);
  } else if (method == 'GET' && url.startsWith('/api/products/filter=')) {
    await getFilteredProductsApi(req, res);
  }
}
