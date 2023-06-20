import { sendConfirmationEmail } from '../emailService.js';
import querystring from 'querystring';
import crypto from 'crypto';
import mysql from 'mysql2';

/*const handleSignUpPost = (req, res) => {
    try {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            let values = querystring.parse(body);
            console.log(values);
            console.log(body);
            const email = values.email;
            const username = values.username;
            const password = values.password;
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            console.log('Hashed password:', hashedPassword);

            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'gimme'
            });

            connection.connect();

            const userSql = 'INSERT INTO users (id, username, email) VALUES (DEFAULT, ?, ?)';
            connection.query(userSql, [username, email], (error, userResult) => {
                if (error) {
                    console.error('Error inserting user data:', error);
                } else {
                    console.log('User data inserted successfully.');
                    const userId = userResult.insertId;
                    const passwordSql = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
                    connection.query(passwordSql, [userId, hashedPassword], (error, passwordResult) => {
                        if (error) {
                            console.error('Error inserting hashed password:', error);
                        } else {
                            console.log('Hashed password inserted successfully.');
                        }
                    });
                }
            });

            sendConfirmationEmail(email, username);
            res.writeHead(302, { 'Location': '../' });
            res.end();
        });
    } catch (err) {
        console.log(err);
    }
};

export { handleSignUpPost };
*/