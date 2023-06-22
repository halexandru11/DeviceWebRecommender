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

async function getWishlistProducts() {
  const [rows] = await pool.query('SELECT * FROM wishlist_products');
  return rows;
}

async function getWishlistProductByUserId(user_id) {
  const [rows] = await pool.query(
    'SELECT * FROM wishlist_products WHERE user_id = ?',
    [user_id]
  );
  return rows[0];
}

export async function testWishlistProductsTable() {
  try {
    const wishlistProducts = await getWishlistProducts();
    console.log('All wishlist products:\n', wishlistProducts);

    const wishlistProduct = await getWishlistProductByUserId(1);
    console.log('\n\nWishlist product with user_id 1:\n', wishlistProduct);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
