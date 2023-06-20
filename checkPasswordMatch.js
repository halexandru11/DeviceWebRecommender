import mysql from 'mysql2';

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
