//import { startScraping } from '../../../scrapper/scrapper.js';
const { startScraping } = require('../../../scrapper/scrapper.js');

/*import { scrapeAltex } from '../../../scrapper/scraping-altex.js';
import { scrapeFlanco } from '../../../scrapper/scraping-flanco.js';
import { scrapeEmag } from '../../../scrapper/scraping-emag.js';
import { scrapeMediaGalaxy } from '../../../scrapper/scraping-mediagalaxy.js';*/
const hasAdminJwtCookie = document.cookie.includes('adminJwt');

const adminButton = document.getElementById('adminButton');

if (hasAdminJwtCookie) {
    adminButton.style.display = 'block';
} else {
    adminButton.style.display = 'none';
}

/*adminButton.addEventListener('click', startScraping);

async function startScraping2() {
    await Promise.all([
        scrapeAltex(),
        scrapeEmag(),
        scrapeFlanco(),
        scrapeMediaGalaxy(),
    ]);
}*/
