import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
}).promise();

export async function getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    const users = [];
  
    rows.forEach(user => {
        let notNullAttributes = {};
        for (const key in user) {
            const value = user[key];
            if(value !== null && value !== '') {
                notNullAttributes[key] = value;
            }
        }
        users.push(notNullAttributes);
    });
    return users;
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

export async function validateUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if(rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function validateEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if(rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function getNumberOfUsers() {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM users');
    return rows[0].count;
}

export async function createUser(user) {
    user.password = await hashPassword(user.password);
   
  const id = await getNumberOfUsers() + 1;

    await pool.query('INSERT INTO users (id, username, email) VALUES (?, ?, ?)',
    [id, user.username, user.email]);
    await pool.query('INSERT INTO passwords (user_id, password) VALUES (?, ?)',
    [id, user.password]);
    return user;
}

export async function getUserByUsername (username)  {
    const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
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

export async function getUserById(id) {
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