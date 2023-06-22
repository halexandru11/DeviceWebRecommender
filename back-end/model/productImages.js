import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
}).promise();

export function insertProductImages(productList) {
    let connection;

    return new Promise((resolve, reject) => {
        try {
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'gimme'
            });

            connection.connect();

            const query = 'INSERT INTO product_images (id,product_id, image_url) VALUES ?';
            const values = productList.map((product) => {
                return [
                    null, // Assuming `id` is auto-incremented
                    null,
                    product.img,
                ];
            });

            connection.query(query, [values], (error) => {
                if (error) {
                    console.error('Error inserting product images:', error);
                    reject(error);
                } else {
                    console.log('Product images inserted successfully.');
                    resolve({ status: 200, message: 'Product images inserted successfully.' });
                }
            });
        } catch (error) {
            console.error('Error inserting product images:', error);
            reject(error);
        } finally {
            if (connection) {
                connection.end();
            }
        }
    });
}

async function getImageById(id) {
    const [rows] = await pool.query('SELECT image_url FROM product_images WHERE id = ?', [id]);
    return rows;
}

export async function getProductImageUrlByProductId(productid) {
    const [rows] = await pool.query('SELECT image_url FROM product_images WHERE product_id = ?', [productid]);
    const imageUrl = rows[0]?.image_url || null;
    return imageUrl;
  }

export async function testProductImagesTable() {

    try {
        const productImagesImageUrl = await getProductImagesImageUrl(1);
        console.log('\n\nProduct image url with id 1:\n', productImagesImageUrl);

    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}