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

export function insertVendors(productList) {
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

            const query = 'INSERT INTO vendors (id, name) VALUES ?';
            const values = productList.map((product) => {
                const url = new URL(product.url);
                const vendorName = url.hostname.split('.')[0];
                return [
                    null, // Assuming `id` is auto-incremented
                    vendorName
                ];
            });

            connection.query(query, [values], (error) => {
                if (error) {
                    console.error('Error inserting vendors:', error);
                    reject(error);
                } else {
                    console.log('Vendors inserted successfully.');
                    resolve({ status: 200, message: 'Vendors  inserted successfully.' });
                }
            });
        } catch (error) {
            console.error('Error inserting vendors:', error);
            reject(error);
        } finally {
            if (connection) {
                connection.end();
            }
        }
    });
}


async function getVendors() {
    const [rows] = await pool.query('SELECT * FROM vendors');
    return rows;
}

async function getVendorById(id) {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE id = ?', [id]);
    return rows[0];
}

async function getVendorName(id) {
    const [rows] = await pool.query('SELECT name FROM vendors WHERE id = ?', [id]);
    return rows[0];
}

export async function testVendorsTable() {
    try {
        const vendors = await getVendors();
        console.log('All vendors:\n', vendors);

        const vendor = await getVendorById(1);
        console.log('\n\nVendor with id 1:\n', vendor);

        const vendorName = await getVendorName(1);
        console.log('\n\nVendor name with id 1:\n', vendorName);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}