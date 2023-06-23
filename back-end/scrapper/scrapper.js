import { scrapeAltex } from './scraping-altex.js';
import { scrapeEmag } from './scraping-emag.js';
import { scrapeFlanco } from './scraping-flanco.js';
import { scrapeMediaGalaxy } from './scraping-mediagalaxy.js';

const startScraping = async () => {
  await Promise.all([
    scrapeAltex(),
    scrapeEmag(),
    scrapeFlanco(),
    scrapeMediaGalaxy(),
  ]);
};

startScraping();
