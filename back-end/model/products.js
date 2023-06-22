import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
  })
  .promise();

export function insertProducts(productList) {
  let connection;

  return new Promise((resolve, reject) => {
    try {
      connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });

      connection.connect();

      const query =
        'INSERT INTO products (id, url, name, price, rating, numReviews, vendor_name) VALUES ?';
      const values = productList.map((product) => {
        // const url = new URL(product.url);
        // const vendorName = url.hostname.split('.')[0];
        const url = product.url || 'https://www.emag.ro/';
        const name = product.name || '';
        const price = product.price || 0;
        const rating = product.rating || 0;
        const numReviews = product.numReviews || 0;

        const simpleUrl = url
          .substring(url.indexOf('://') + 3)
          .replace('www.', '');
        const vendorName = simpleUrl.substring(0, simpleUrl.indexOf('.')) || '';
        return [
          null, // Assuming `id` is auto-incremented
          url,
          name,
          price,
          rating,
          numReviews,
          vendorName,
        ];
      });

      connection.query(query, [values], (error) => {
        if (error) {
          console.error('Error inserting products:', error);
          reject(error);
        } else {
          console.log('Products inserted successfully.');
          resolve({ status: 200, message: 'Products inserted successfully.' });
        }
      });
    } catch (error) {
      console.error('Error inserting products:', error);
      reject(error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  });
}

export async function searchTopProducts(username) {
  let connection;

  try {
    connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    connection.connect();

    // Retrieve the top picks for the given username
    const topPicks = await getTopPicks(username);

    // Create an array to store the promises for each search query
    const searchPromises = [];

    // Execute a search query for each top pick
    for (const vendorName of topPicks) {
      const query =
        'SELECT * FROM products WHERE vendor_name = ? ORDER BY rating DESC LIMIT 50';
      const values = [vendorName];

      const searchPromise = new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error(`Error searching products for ${vendorName}:`, error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      searchPromises.push(searchPromise);
    }

    // Wait for all search queries to complete
    const searchResults = await Promise.all(searchPromises);

    // Concatenate and sort the search results by rating in descending order
    const topProducts = searchResults
      .flat()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 50);

    console.log('Top 50 products:', topProducts);
    return topProducts;
  } catch (error) {
    console.error('Error searching top products:', error);
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

export async function insertWishlistProducts(productList, username) {
  let connection;

  return new Promise(async (resolve, reject) => {
    try {
      connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });

      connection.connect();

      const query =
        'INSERT INTO wishlist_products (id, product_url, name, price, rating, numReviews, vendor_name, username, score) VALUES ?';
      const values = await Promise.all(
        productList.map(async (product) => {
          const url = new URL(product.url);
          const vendorName = url.hostname.split('.')[0];
          const scoreResult = await getCurrentScoreByUrl(product.url);

          const score = scoreResult.currentScore || 0;
          console.log(score);
          return [
            null, // Assuming `id` is auto-incremented
            product.url,
            product.name,
            product.price,
            product.rating,
            product.numReviews,
            vendorName,
            username,
            score,
          ];
        })
      );

      connection.query(query, [values], (error) => {
        if (error) {
          console.error('Error inserting products:', error);
          reject(error);
        } else {
          console.log('Products inserted successfully.');
          resolve({ status: 200, message: 'Products inserted successfully.' });
        }
      });
    } catch (error) {
      console.error('Error inserting products:', error);
      reject(error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  });
}

export async function insertWishlistProductsIfNotExist(productList, username) {
  const existingProducts = await Promise.all(
    productList.map(async (product) => {
      const exists = await checkWishlistProductExists(product.url, username);
      return exists ? product : null;
    })
  );

  const newProducts = existingProducts.filter((product) => product === null);

  if (newProducts.length > 0) {
    return insertWishlistProducts(newProducts, username);
  } else {
    return Promise.resolve({
      status: 200,
      message: 'All products already exist in the wishlist.',
    });
  }
}

export async function checkWishlistProductExists(productUrl, username) {
  let connection;

  return new Promise(async (resolve, reject) => {
    try {
      connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });

      connection.connect();

      const query =
        'SELECT COUNT(*) AS count FROM wishlist_products WHERE product_url = ? AND username = ?';
      const values = [productUrl, username];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error checking product existence:', error);
          reject(error);
        } else {
          const count = results[0].count;
          const exists = count > 0;
          resolve(exists);
        }
      });
    } catch (error) {
      console.error('Error checking product existence:', error);
      reject(error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  });
}

export function getCurrentScoreByUrl(url) {
  let connection;

  return new Promise((resolve, reject) => {
    try {
      connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });

      connection.connect();

      const query =
        'SELECT score FROM wishlist_products WHERE product_url = ? ORDER BY id DESC LIMIT 1';

      connection.query(query, [url], (error, results) => {
        if (error) {
          console.error('Error retrieving current score:', error);
          reject(error);
        } else {
          if (results.length > 0) {
            const currentScore = results[0].score;
            console.log('Current score retrieved successfully.');
            resolve({ status: 200, currentScore });
          } else {
            console.log('No score found for the given URL.');
            resolve({ status: 200, currentScore: null });
          }
        }
      });
    } catch (error) {
      console.error('Error retrieving current score:', error);
      reject(error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  });
}
export async function getTopPicks(username) {
  //this selects the top picks from wishlist products
  let connection;

  try {
    connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    connection.connect();

    const query =
      'SELECT vendor_name FROM wishlist_products WHERE username = ? ORDER BY score DESC LIMIT 5';
    const values = [username];

    return new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error retrieving top picks:', error);
          reject(error);
        } else {
          const topPicks = results.map((row) => row.vendor_name);
          console.log('Top picks retrieved successfully:', topPicks);
          resolve(topPicks);
        }
      });
    });
  } catch (error) {
    console.error('Error retrieving top picks:', error);
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

export async function updateWishlistProductsScore(username, productList) {
  let connection;

  try {
    connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    connection.connect();

    const updatePromises = productList.map(async (product) => {
      const query =
        'UPDATE wishlist_products SET score = score + 0.33 WHERE username = ? AND product_url = ?';
      const values = [username, product.url];

      return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error(
              `Error updating score for product ${product.url}:`,
              error
            );
            reject(error);
          } else {
            console.log(
              `Score updated successfully for product ${product.url}.`
            );
            resolve();
          }
        });
      });
    });

    await Promise.all(updatePromises);
    console.log('All wishlist product scores updated successfully.');
  } catch (error) {
    console.error('Error updating wishlist product scores:', error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

async function getProducts() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function getProductUrl(id) {
  const [rows] = await pool.query('SELECT url FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductName(id) {
  const [rows] = await pool.query('SELECT name FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductDescription(id) {
  const [rows] = await pool.query(
    'SELECT description FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductVendorId(id) {
  const [rows] = await pool.query(
    'SELECT vendor_id FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductPrice(id) {
  const [rows] = await pool.query('SELECT price FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductRating(id) {
  const [rows] = await pool.query('SELECT rating FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductColor(id) {
  const [rows] = await pool.query('SELECT color FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductDevicTypeId(id) {
  const [rows] = await pool.query(
    'SELECT device_type_id FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductGeneralCharacteristics(id) {
  const [rows] = await pool.query(
    'SELECT general_characteristics FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductTechnicalCharacteristics(id) {
  const [rows] = await pool.query(
    'SELECT technical_characteristics FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductProcessor(id) {
  const [rows] = await pool.query(
    'SELECT processor FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductMotherboard(id) {
  const [rows] = await pool.query(
    'SELECT mother_board FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductHardDisk(id) {
  const [rows] = await pool.query(
    'SELECT hard_disk FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductGraphicsCard(id) {
  const [rows] = await pool.query(
    'SELECT graphics_card FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductMemory(id) {
  const [rows] = await pool.query('SELECT memory FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductStorage(id) {
  const [rows] = await pool.query('SELECT storage FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductDisplay(id) {
  const [rows] = await pool.query('SELECT display FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductConnectivity(id) {
  const [rows] = await pool.query(
    'SELECT connectivity FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductAutonomy(id) {
  const [rows] = await pool.query(
    'SELECT autonomy FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductCharging(id) {
  const [rows] = await pool.query(
    'SELECT charging FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductEfficiency(id) {
  const [rows] = await pool.query(
    'SELECT efficiency FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductMultimedia(id) {
  const [rows] = await pool.query(
    'SELECT multimedia FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductPhotoVideo(id) {
  const [rows] = await pool.query(
    'SELECT photo_video FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductAudio(id) {
  const [rows] = await pool.query('SELECT audio FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductSoftware(id) {
  const [rows] = await pool.query(
    'SELECT software FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductFunctions(id) {
  const [rows] = await pool.query(
    'SELECT functions FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductSmartTv(id) {
  const [rows] = await pool.query(
    'SELECT smart_tv FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductDimensions(id) {
  const [rows] = await pool.query(
    'SELECT dimentions FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductCasing(id) {
  const [rows] = await pool.query('SELECT casing FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

async function getProductAccessories(id) {
  const [rows] = await pool.query(
    'SELECT accessories FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductEnergyConsumption(id) {
  const [rows] = await pool.query(
    'SELECT energy_consumption FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getProductBrand(id) {
  const [rows] = await pool.query('SELECT brand FROM products WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

export async function testProductsTable() {
  try {
    const notes = await getProducts();
    console.log('All Notes:\n', notes);

    const note = await getProductById(1);
    console.log('\n\nNote with ID 1:\n', note);

    const url = await getProductUrl(1);
    console.log('\n\nUrl with ID 1:\n', url);

    const name = await getProductName(1);
    console.log('\n\nName with ID 1:\n', name);

    const description = await getProductDescription(1);
    console.log('\n\nDescription with ID 1:\n', description);

    const vendor_id = await getProductVendorId(1);
    console.log('\n\nVendor_id with ID 1:\n', vendor_id);

    const price = await getProductPrice(1);
    console.log('\n\nPrice with ID 1:\n', price);

    const rating = await getProductRating(1);
    console.log('\n\nRating with ID 1:\n', rating);

    const color = await getProductColor(1);
    console.log('\n\nColor with ID 1:\n', color);

    const device_type_id = await getProductDevicTypeId(1);
    console.log('\n\nDevice_type_id with ID 1:\n', device_type_id);

    const general_characteristics = await getProductGeneralCharacteristics(1);
    console.log('\n\nGeneral_characteristics:\n', general_characteristics);

    const technical_characteristics = await getProductTechnicalCharacteristics(
      1
    );
    console.log('\n\nTechnical_characteristics:\n', technical_characteristics);

    const processor = await getProductProcessor(1);
    console.log('\n\nProcessor:\n', processor);

    const motherboard = await getProductMotherboard(1);
    console.log('\n\nMotherboard:\n', motherboard);

    const hard_disk = await getProductHardDisk(1);
    console.log('\n\nHard_disk:\n', hard_disk);

    const graphics_card = await getProductGraphicsCard(1);
    console.log('\n\nGraphics_card:\n', graphics_card);

    const memory = await getProductMemory(1);
    console.log('\n\nMemory:\n', memory);

    const storage = await getProductStorage(1);
    console.log('\n\nStorage:\n', storage);

    const display = await getProductDisplay(1);
    console.log('\n\nDisplay:\n', display);

    const connectivity = await getProductConnectivity(1);
    console.log('\n\nConnectivity:\n', connectivity);

    const autonomy = await getProductAutonomy(1);
    console.log('\n\nAutonomy:\n', autonomy);

    const charging = await getProductCharging(1);
    console.log('\n\nCharging:\n', charging);

    const efficiency = await getProductEfficiency(1);
    console.log('\n\nEfficiency:\n', efficiency);

    const multimedia = await getProductMultimedia(1);
    console.log('\n\nMultimedia:\n', multimedia);

    const photo_video = await getProductPhotoVideo(1);
    console.log('\n\nPhoto_video:\n', photo_video);

    const audio = await getProductAudio(1);
    console.log('\n\nAudio:\n', audio);

    const software = await getProductSoftware(1);
    console.log('\n\nSoftware:\n', software);

    const functions = await getProductFunctions(1);
    console.log('\n\nFunctions:\n', functions);

    const smart_tv = await getProductSmartTv(1);
    console.log('\n\nSmart_tv:\n', smart_tv);

    const dimensions = await getProductDimensions(1);
    console.log('\n\nDimensions:\n', dimensions);

    const casing = await getProductCasing(1);
    console.log('\n\nCasing:\n', casing);

    const accessories = await getProductAccessories(1);
    console.log('\n\nAccessories:\n', accessories);

    const energy_consumption = await getProductEnergyConsumption(1);
    console.log('\n\nEnergy_consumption:\n', energy_consumption);

    const brand = await getProductBrand(1);
    console.log('\n\nBrand:\n', brand);
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    pool.end();
  }
}
