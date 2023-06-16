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

async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function getUserEmail(id) {
    const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function getUserUsername(id) {
    const [rows] = await pool.query('SELECT username FROM users WHERE id = ?', [id]);
    return rows[0];
}

export async function testUsersTable() {
    try {
        const users = await getUsers();
        console.log('All users:\n', users);
        
        const user = await getUserById(1);
        console.log('\n\nUser with id 1:\n', user);
        
        const userEmail = await getUserEmail(1);
        console.log('\n\nUser email with id 1:\n', userEmail);
        
        const userUsername = await getUserUsername(1);
        console.log('\n\nUser username with id 1:\n', userUsername);
        
        const userByEmail = await getUserByEmail('spattison0@independent.co.uk');
        console.log('\n\nUser with email spattison0@independent.co.uk', userByEmail);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}