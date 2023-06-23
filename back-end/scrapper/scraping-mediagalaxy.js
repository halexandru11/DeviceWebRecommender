import cheerio from 'cheerio';
import fs from 'fs';
import UserAgent from 'user-agents';
import { insertProducts } from '../model/products.js';

const baseUrl = 'https://mediagalaxy.ro';

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

    const bigPrice = product.price || '';
    const smallPrice = product.small || '';
    const price = parseFloat(
      bigPrice.replaceAll('.', '') + smallPrice.replaceAll(',', '.')
    );

    const ratingString = product.rating || '0 (0)';
    const rating = parseFloat(ratingString.split('(')[0]);
    const numReviews = parseInt(ratingString.split('(')[1].split(')')[0]);

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
    $('.Products li').each((_, element) => {
      const product = {
        name: $(element).find('.Product-name').text(),
        price: $(element).find('.text-red-brand span .Price-int').text(),
        small: $(element).find('.text-red-brand span sup').text(),
        url: baseUrl + $(element).find('.Product a').first().attr('href'),
        img: $(element).find('.Product-photoWrapper img').attr('src'),
        rating: $(element).find('span .ml-1').first().text(),
      };
      if (product.name && product.price && product.url && product.img) {
        products.push(product);
      }
    });

    const normalizedProducts = normalizeProducts(products);

    const nextPageButton = $('.mb-6 nav a').last();
    if (nextPageButton && nextPageButton.text().toLowerCase().includes('urm')) {
      const nextPageUrl = nextPageButton.attr('href');
      return [normalizedProducts, nextPageUrl];
    }
    return [normalizedProducts, null];
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
  'telefoane',
  'tablete',
  'boxe-portabile-telefoane-tablete',
  'casti-telefon',
  'laptopuri',
  'monitoare-pc',
  'suport-monitor',
  'software',
  'televizoare',
  'media-playere',
  'videoproiectoare-accesorii',
  'suporturi-tv',
  'baterii-audio-video-foto',
];

const scrapeMediaGalaxy = async () => {
  for (let link of links) {
    const url = `${baseUrl}/${link}/cpl`;
    const products = await getProductsFromAllPages(url);
    console.log('mediagalaxy', products.length, link);
    const filename = `./data/mediagalaxy/${link}.json`;
    writeProductsToFile(filename, products);
    // save to database
    insertProducts(products);
  }
};

export { scrapeMediaGalaxy };
