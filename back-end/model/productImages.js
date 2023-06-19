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

async function getProductImages() {
    const [rows] = await pool.query('SELECT * FROM product_images');
    return rows;
}

async function getProductImageById(id) {
    const [rows] = await pool.query('SELECT * FROM product_images WHERE id = ?', [id]);
    return rows[0];
}

async function getProductImagesProductId(id) {
    const [rows] = await pool.query('SELECT product_id FROM product_images WHERE id = ?', [id]);
    return rows;
}

async function getProductImagesImageUrl(id) {
    const [rows] = await pool.query('SELECT image_url FROM product_images WHERE id = ?', [id]);
    return rows;
}

export async function testProductImagesTable() {

    try {
        const productImages = await getProductImages();
        console.log('All product images:\n', productImages);

        const productImage = await getProductImageById(1);
        console.log('\n\nProduct image with id 1:\n', productImage);

        const productImagesProductId = await getProductImagesProductId(1);
        console.log('\n\nProduct image product id with id 1:\n', productImagesProductId);

        const productImagesImageUrl = await getProductImagesImageUrl(1);
        console.log('\n\nProduct image image url with id 1:\n', productImagesImageUrl);

    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}