import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import querystring from 'querystring';
import { selectUserIdByUsername } from '../model/users.js';
import { checkPasswordMatch } from '../model/passwords.js';
const handleSignInPost = async (req, res) => {
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

            try {
                //why does it only work here???
                const token = jwt.sign({ name: username }, process.env.ACCESS_TOKEN_SECRET);
                console.log('JWT:', token);
                const encodedToken = Buffer.from(token).toString('base64');
                const cookieValue = `jwtSignIn=${encodedToken}; Path=/`;
                res.setHeader('Set-Cookie', cookieValue);
                res.writeHead(302, {
                    Location: "../"
                });
                res.end();


                const userId = await selectUserIdByUsername(username);
                if (userId) {
                    // User found
                    console.log("User ID:", userId);
                    try {
                        const passwordMatch = await checkPasswordMatch(userId, hashedPassword);
                        if (passwordMatch) {
                            console.log("Password matches.");
                            // Continue with successful login process

                        } else {
                            // Password does not match
                            console.log("Passwords do not match.");
                            res.write("Passwords do not match!");
                            res.end();
                        }

                    } catch (error) {
                        console.error("Error checking password match:", error);
                    }
                } else {
                    console.log("User not found.");
                }
            } catch (error) {
                console.error("Error retrieving user information:", error);
            }
        });
    } catch (error) {
        console.error("Error handling sign-in post:", error);
    }
};

export { handleSignInPost };