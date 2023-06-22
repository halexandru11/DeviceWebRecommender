import cheerio from 'cheerio';
import fs from 'fs';
import UserAgent from 'user-agents';
import { insertProducts } from '../model/products.js';

const baseUrl = 'https://emag.ro';

const writeProductsToFile = async (filename, products) => {
  fs.writeFile(filename, JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('File written successfully\n');
    }
  });
};

const readProductsFromFile = (filename) => {
  try {
    const productsJson = fs.readFileSync(filename, 'utf8');
    const products = JSON.parse(productsJson);
    return products;
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return null;
  }
};

const scrapeUrl = async (url) => {
  try {
    const userAgent = new UserAgent();
    const headers = {
      'User-Agent': userAgent.toString(),
    };
    const response = await fetch(url, { headers });
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

const normalizeProducts = (products) => {
  const normalizedProducts = products.map((product) => {
    const name = product.name || '';

    const price = parseFloat(
      product.price
        .toLowerCase()
        .replace('lei', '')
        .replaceAll('.', '')
        .replaceAll(',', '.')
    );

    const rating = parseFloat(product.rating || '0');
    const numReviews = parseInt(
      product.numReviews.replace('(', '').replace(')', '') || '0'
    );

    return {
      name,
      price,
      url: product.url,
      img: product.img,
      rating,
      numReviews,
    };
  });

  return normalizedProducts;
};

const getProductsFromPage = async (url) => {
  try {
    const html = await scrapeUrl(url);
    const $ = cheerio.load(html);
    const products = [];
    $('#card_grid .card-item').each((_, element) => {
      const product = {
        name: $(element)
          .find('.card-v2-info .card-v2-title-wrapper .card-v2-title')
          .text(),
        price: $(element).find('.card-v2-pricing .product-new-price').text(),
        url: $(element)
          .find('.card-v2-info .card-v2-title-wrapper .card-v2-title')
          .attr('href'),
        img: $(element).find('.card-v2-thumb-inner img').attr('src'),
        rating: $(element)
          .find('.card-v2-info .card-v2-rating .average-rating')
          .text(),
        numReviews: $(element)
          .find('.card-v2-info .card-v2-rating .star-rating-text span')
          .last()
          .text(),
      };
      if (product.name && product.url && product.price && product.img) {
        products.push(product);
      }
    });

    const normalizedProducts = normalizeProducts(products);

    const nextPageButton = $('#listing-paginator .js-next-page').attr('href');
    if (nextPageButton && !nextPageButton.includes('http')) {
      const nextPageUrl = baseUrl + nextPageButton;
      return [normalizedProducts, nextPageUrl];
    }
    return [normalizedProducts, nextPageButton || null];
  } catch (error) {
    console.log(error);
  }
  return [null, null];
};

const getProductsFromAllPages = async (url) => {
  let products = [];
  let nextPageUrl = url;
  while (nextPageUrl) {
    const [newProducts, newNextPageUrl] = await getProductsFromPage(
      nextPageUrl
    );
    if (newProducts) {
      products = [...products, ...newProducts];
    }
    nextPageUrl = newNextPageUrl;
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  return products;
};

const links = [
  'drone/brand/dji/c?ref=banner_0_1',
  'laptopuri/c?ref=hp_menu_quick-nav_1_1&type=category',
  'telefoane-mobile/c?ref=hp_menu_quick-nav_1_16&type=category',
  'tablete/c?ref=hp_menu_quick-nav_1_32&type=category',
  'smartwatch/c?ref=hp_menu_quick-nav_1_36&type=category',
  'desktop-pc/c?ref=hp_menu_quick-nav_23_1&type=category',
  'monitoare-lcd-led/c?ref=hp_menu_quick-nav_23_3&type=category',
  'imprimante-multifunctionale/c?ref=hp_menu_quick-nav_23_33&type=filter',
  'televizoare/c?ref=hp_menu_quick-nav_190_1&type=category',
  'boxe/c?ref=hp_menu_quick-nav_190_16&type=category',
  'casti-audio/c?ref=hp_menu_quick-nav_190_25&type=category',
  'camere-video-sport/c?ref=banner_1_0',
];

const scrapeEmag = async () => {
  for (let link of links) {
    const url = `${baseUrl}/${link}`;
    const products = await getProductsFromAllPages(url);
    console.log('emag', products.length, link);
    const path = link.substring(0, link.indexOf('/'));
    const filename = `./data/emag/${path}.json`;
    writeProductsToFile(filename, products);
    // save to database
    insertProducts(products);
  }
};

export { scrapeEmag };
