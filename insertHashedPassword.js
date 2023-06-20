import mysql from 'mysql2';

export function insertHashedPassword(userId, hashedPassword) {
    let connection; // Declare the connection variable

    return new Promise((resolve, reject) => {
        try {
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'gimme'
            });
            connection.connect();
            const query = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
            const values = [userId, hashedPassword];

            connection.query(query, values, (error) => {
                if (error) {
                    console.error('Error inserting hashed password:', error);
                    reject(error);
                } else {
                    console.log('Hashed password inserted successfully.');
                    resolve({ status: 200, message: 'Hashed password inserted successfully.' });
                }
            });
        } catch (error) {
            console.error('Error inserting hashed password:', error);
            reject(error);
        } finally {
            if (connection) {
                connection.end();
            }
        }
    });
}
