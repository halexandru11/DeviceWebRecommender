import { startScraping } from '../scrapper/scrapper.js';

export async function adminController(req, res) {
  const url = req.url;
  const method = req.method;
  console.log('url: ', url);

  if (method == 'GET' && url === '/api/admin/start-scraping') {
    await startScraping();
  }
}
