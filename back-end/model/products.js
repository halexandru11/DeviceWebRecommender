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
          console.log('These are the values: ', values);
          reject(error);
        } else {
          console.log('Products inserted successfully.');
          resolve({
            status: 200,
            message: 'Products inserted successfully.',
          });
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

export async function getProductSpecificationsById(id) {
    const [result] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if(result.length === 0) {
        return null; }
    
    let notNullAttributes = {};
    for (const key in result[0]) {
        const value = result[0][key];
        if(value !== null && value !== '') {
            notNullAttributes[key] = value;
        }
    }
    return notNullAttributes;
}

export async function getAllProducts() {
    const [rows] = await pool.query('SELECT * FROM products');
    const products = [];
  
    rows.forEach(product => {
        let notNullAttributes = {};
        for (const key in product) {
            const value = product[key];
            if(value !== null && value !== '') {
                notNullAttributes[key] = value;
            }
        }
        products.push(notNullAttributes);
    });
    return products;
}

export async function insertWishlistProduct(product, username) {
    pool.query('INSERT INTO wishlist_products (id, product_url, name, description, price, rating, numReviews, vendor_name, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
     [null, product.url, product.name, product.description, product.price, product.rating, product.numReviews, product.vendorName, username]);
    return { status: 200, message: 'Product inserted successfully.' };
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
