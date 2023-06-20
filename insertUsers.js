import mysql from 'mysql2';
import { sendConfirmationEmail } from './emailService.js';
export function insertUser(username, email, res) {
    return new Promise((resolve, reject) => {
        try {
            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'gimme'
            });
            connection.connect();

            const query = "INSERT INTO users (id, username, email) VALUES (DEFAULT, ?, ?)";
            const values = [username, email];

            connection.query(query, values, (error, result) => {
                if (error) {
                    console.error("Error inserting user:", error);
                    if (error.code === "ER_DUP_ENTRY") {
                        reject(new Error("Username or email already exists."));
                    } else {
                        reject(error);
                    }
                } else {

                    const insertedUserId = result.insertId;
                    console.log("User inserted successfully. ID:", insertedUserId);
                    sendConfirmationEmail(email, username);
                    try {
                        resolve(insertedUserId);
                    } catch (confirmationError) {
                        reject(confirmationError);
                    }
                }

                connection.end(); // Close the connection after executing the query
            });
        } catch (error) {
            console.error("Error inserting user:", error);
            reject(error);
        }
    });
}
