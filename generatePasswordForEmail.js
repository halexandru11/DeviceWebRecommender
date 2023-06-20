import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const generatePasswordForEmail = async (id, hashedUsername) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'gimme'
        });

        connection.connect();

        const updateSql = 'UPDATE passwords SET password = ? WHERE user_id = ?';

        connection.query(updateSql, [hashedUsername, id], (error, results) => {
            if (error) {
                console.error('Error updating password:', error);
                reject(error);
            } else {
                resolve(hashedUsername);
            }
            connection.end();
        });
    });
};
