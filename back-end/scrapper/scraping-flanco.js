import cheerio from 'cheerio';
import fs from 'fs';
import UserAgent from 'user-agents';

const baseUrl = 'https://flanco.ro';

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
        .replace('.', '')
        .replace(',', '.')
        .toLowerCase()
        .replace('lei', '')
        .trim()
    );

    const rating = (parseFloat(product.rating.replace('%', '')) || 0) / 20;
    const numReviews = parseInt(product.numReviews.split(' ')[0]);

    const img = product.img.substring(product.img.indexOf('http'));

    return {
      name,
      price,
      url: product.url,
      img,
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
    $('.products-grid ol li').each((_, element) => {
      const product = {
        name: $(element).find('strong .product-item-link h2').text(),
        price:
          $(element).find('.price-box .special-price .price').text() ||
          $(element).find('.price-box .singlePrice .price').text(),
        url: $(element).find('.photo').first().attr('href'),
        img: $(element)
          .find('.photo')
          .first()
          .find('span span img')
          .attr('src'),
        rating: $(element).find('.rating-summary div span span').text(),
        numReviews: $(element).find('.reviews-actions div').text(),
      };
      if (product.name && product.price && product.url && product.img) {
        products.push(product);
      }
    });

    const normalizedProducts = normalizeProducts(products);

    const nextPageButton = $('.pages-item-next').last().find('a').attr('href');
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
  'laptop-it-tablete/desktop-pc-monitoare/all-in-one-pc.html',
  'telefoane-tablete/smartphone.html',
  'telefoane-tablete/smartwatch-si-smartband/smartwatch.html',
  'telefoane-tablete/smartwatch-si-smartband/smartband.html',
  'telefoane-tablete/smartwatch-si-smartband/accesorii.html',
  'telefoane-tablete/periferice-mobile/acumulatori-externi.html',
  'telefoane-tablete/tablete-si-accesorii/tablete-ios.html',
  'telefoane-tablete/tablete-si-accesorii/tablete-android.html',
  'telefoane-tablete/tablete-si-accesorii/ebook-reader.html',
  'telefoane-tablete/accesorii-tablete.html',
  'tv-electronice-foto/televizoare.html',
  'tv-electronice-foto/top-branduri/samsung.html',
  'tv-electronice-foto/top-branduri/lg.html',
  'tv-electronice-foto/top-branduri/sony.html',
  'tv-electronice-foto/top-branduri/horizon.html',
  'tv-electronice-foto/top-branduri/nei.html',
  'tv-electronice-foto/top-branduri/vision-touch.html',
  'tv-electronice-foto/top-branduri/orion.html',
  'tv-electronice-foto/foto-video/aparate-foto-compacte.html',
  'tv-electronice-foto/foto-video/camere-video-sport.html',
  'tv-audio-video-foto/casti/casti-true-wireless.html',
  'tv-audio-video-foto/casti/casti-over-si-on-ear.html',
  'tv-audio-video-foto/casti/casti-in-ear.html',
  'tv-audio-video-foto/casti/casti-bluetooth.html',
  'tv-audio-video-foto/boxe-portabile.html',
  'laptop-it-tablete/laptop.html',
  'laptop-it-tablete/imprimante-consumabile/imprimante.html',
  'laptop-it-tablete/imprimante-consumabile/multifunctionale.html',
  'laptop-it-tablete/stocare-date/solid-state-drive-ssd.html',
  'laptop-it-tablete/stocare-date/hard-disk-uri-externe.html',
  'laptop-it-tablete/stocare-date/memorii-usb.html',
  'laptop-it-tablete/desktop-pc-monitoare/desktop-pc.html',
];

const scrapeFlanco = async () => {
  for (let link of links) {
    const url = `${baseUrl}/${link}`;
    const products = await getProductsFromAllPages(url);
    console.log('flanco', products.length, link);
    const path = link.substring(link.lastIndexOf('/') + 1);
    const filename = `./data/flanco/${path}.json`;
    writeProductsToFile(filename, products);
    // TODO: save to database
  }
};

export { scrapeFlanco };
