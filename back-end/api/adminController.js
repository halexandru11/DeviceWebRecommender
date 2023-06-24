import { startScraping } from '../scrapper/scrapper.js';

async function startScrapingApi(req, res) {
  try {
    console.log('startScrapingApi');
    await startScraping();
    res.statusCode = 200;
    res.end(JSON.stringify({ products }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}

export async function adminController(req, res) {
  const url = req.url;
  const method = req.method;
  console.log('url: ', url);

  if (method == 'GET' && url === '/api/admin/start-scraping') {
    await startScraping();
  }
}
