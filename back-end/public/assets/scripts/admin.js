
const hasAdminJwtCookie = document.cookie.includes('adminJwt');

const adminButton = document.getElementById('adminButton');

if (hasAdminJwtCookie) {
    adminButton.style.display = 'block';
} else {
    adminButton.style.display = 'none';
}

adminButton.addEventListener('click', startScraping);

async function startScraping() {
    await Promise.all([
        scrapeAltex(),
        scrapeEmag(),
        scrapeFlanco(),
        scrapeMediaGalaxy(),
    ]);
}
import { startScraping } from '../../../scrapper/scrapper.js';
import { scrapeAltex } from '../../../scrapper/scraping-altex.js';
import { scrapeFlanco } from '../../../scrapper/scraping-flanco.js';
import { scrapeMediaGalaxy } from '../../../scrapper/scraping-mediagalaxy.js';