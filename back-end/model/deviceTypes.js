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

async function getDevices() {
    const [rows] = await pool.query('SELECT * FROM device_types');
    return rows;
}

async function getDeviceById(id) {
    const [rows] = await pool.query('SELECT * FROM  device_types WHERE id = ?', [id]);
    return rows[0];
}

async function getDeviceName(id) {
    const [rows] = await pool.query('SELECT name FROM  device_types WHERE id = ?', [id]);
    return rows[0];
}

export async function testDeviceTypesTable() {
    
    try {
        const devices = await getDevices();
        console.log('All devices:\n', devices);

        const device = await getDeviceById(1);
        console.log('\n\nDevice with id 1:\n', device);

        const deviceName = await getDeviceName(1);
        console.log('\n\nDevice name with id 1:\n', deviceName);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}