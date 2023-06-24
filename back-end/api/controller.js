import { productController } from './productsController.js';

const handleApiRequest = (req, res) => {
  const url = req.url;
  console.log('url: ', url);
  console.log('heeeellooo');
  res.setHeader('Content-Type', 'application/json');

  if (url.startsWith('/api/products')) {
    productController(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route Not Found!' }));
  }
};
export default handleApiRequest;
