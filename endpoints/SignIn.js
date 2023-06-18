import crypto from 'crypto';
import querystring from 'querystring';
import mysql from 'mysql2';

const handleSignInPost = (req, res) => {
    try {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
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
            connection.query(userSql, [username], (error, userResults) => {
                if (error) {
                    console.error('Error querying user:', error);
                } else {
                    if (userResults.length === 0) {
                        console.log('User does not exist.');
                        //Handle user does not exist case

                    } else {
                        const userId = userResults[0].id;
                        const passwordSql = 'SELECT user_id FROM passwords WHERE user_id = ? AND password = ?';
                        connection.query(passwordSql, [userId, hashedPassword], (error, passwordResults) => {
                            if (error) {
                                console.error('Error querying password:', error);
                            } else {
                                if (passwordResults.length === 0) {
                                    console.log('Incorrect password.');
                                    //Handle incorrect password case
                                } else {
                                    console.log('User authenticated successfully. User ID:', userId);
                                    //Handle successful authentication

                                }
                            }
                        });
                    }
                }
            });
            res.writeHead(302, { 'Location': '../' });
            res.end();
        });
    } catch (err) {
        console.log(err);
    }
};

export { handleSignInPost };
