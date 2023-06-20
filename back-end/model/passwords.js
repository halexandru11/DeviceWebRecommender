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


export function checkPasswordMatch(userId, hashedPassword) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'gimme'
        });

        connection.connect();

        const query = "SELECT * FROM passwords WHERE user_id = ? AND password = ?";
        const values = [userId, hashedPassword];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error("Error checking password match:", error);
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }

            connection.end();
        });
    });
}
async function getPasswords() {
    const [rows] = await pool.query('SELECT * FROM passwords');
    return rows;
}

async function getPasswordByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM passwords WHERE user_id = ?', [user_id]);
    return rows[0];
}

export async function testPasswordsTable() {

    try {
        const passwords = await getPasswords();
        console.log('All passwords:\n', passwords);

        const password = await getPasswordByUserId(1);
        console.log('\n\nPassword with user_id 1:\n', password)

    }
    catch (err) {
        console.log(err);
    }
    finally {
        pool.end();
    }
}