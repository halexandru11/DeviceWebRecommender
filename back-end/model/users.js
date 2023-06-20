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


export const getUserDetailsByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'gimme'
        });

        connection.connect();

        const userSql = 'SELECT username, id FROM users WHERE email = ?';

        connection.query(userSql, [email], (error, results) => {
            if (error) {
                console.error('Error querying user:', error);
                reject(error);
            } else {
                resolve(results);
            }
            connection.end();
        });
    });
};


export function selectUserIdByUsername(username) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'gimme'
        });

        connection.connect();

        const query = "SELECT id FROM users WHERE username = ?";
        const values = [username];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error("Error selecting user ID:", error);
                reject(error);
            } else {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    const userId = results[0].id;
                    console.log("User ID selected successfully:", userId);
                    resolve(userId);
                }
            }
            connection.end();
        });
    });
}

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