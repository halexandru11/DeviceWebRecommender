import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

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
