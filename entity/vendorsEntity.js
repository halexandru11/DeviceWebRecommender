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