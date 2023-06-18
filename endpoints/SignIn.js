import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import querystring from 'querystring';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

const handleSignInPost = (req, res) => {
    try {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            let values = querystring.parse(body);
            console.log(values);
            console.log(body);
            const password = values.password;
            const username = values.username;
            console.log('Username:', username);

            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            console.log('Hashed password:', hashedPassword);

            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'gimme'
            });

            connection.connect();

            const userSql = 'SELECT id FROM users WHERE username = ?';
            let redirectLocation;
            connection.query(userSql, [username], (error, userResults) => {
                if (error) {
                    console.error('Error querying user:', error);
                } else {

                    if (userResults.length === 0) {
                        console.log('User does not exist.');
                        //Handle user does not exist case
                        redirectLocation = '../pages/auth.signin.html';

                    } else {
                        redirectLocation = '../';

                        const userId = userResults[0].id;
                        const passwordSql = 'SELECT user_id FROM passwords WHERE user_id = ? AND password = ?';
                        connection.query(passwordSql, [userId, hashedPassword], (error, passwordResults) => {
                            if (error) {
                                console.error('Error querying password:', error);
                            } else {
                                if (passwordResults.length === 0) {
                                    console.log('Incorrect password.');
                                    //Handle incorrect password case
                                    redirectLocation = '../pages/auth.signin.html';
                                } else {
                                    const userId = userResults[0].id;
                                    console.log('User authenticated successfully. User ID:', userId);
                                    //Handle successful authentication
                                    const token = jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET);
                                    console.log('JWT:', token);
                                    const encodedToken = Buffer.from(token).toString('base64');
                                    const cookieValue = `jwt=${encodedToken}; Domain=www.gimme.com; Path=/; Expires=${new Date(Date.now() + 3600000).toUTCString()}; Secure; HttpOnly`;
                                    res.setHeader('Set-Cookie', cookieValue);
                                }
                            }
                        });
                    }
                }
            });
            //console.log(redirectLocation);
            res.writeHead(302, { 'Location': '../' });
            res.end();
        });
    } catch (err) {
        console.log(err);
    }
};

export { handleSignInPost };
