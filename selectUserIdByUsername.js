import mysql from 'mysql2';

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
