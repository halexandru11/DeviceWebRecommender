import { sendConfirmationEmail } from './emailService.js';
import { insertUser } from '../model/users.js';
import { insertHashedPassword } from '../model/passwords.js';
import querystring from 'querystring';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const handleSignUpPost = async (req, res) => {
    try {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {


            body = Buffer.concat(body).toString();
            let values = querystring.parse(body);
            console.log(values);
            console.log(body);
            const email = values.email;
            const username = values.username;
            const password = values.password;
            const confirm_password = values.confirm_password;
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            console.log('Hashed password:', hashedPassword);

            if (password === confirm_password) {
                try {
                    //problema: cand am username-uri duplicat 
                    const token = jwt.sign({ name: username }, process.env.ACCESS_TOKEN_SECRET);
                    console.log('JWT:', token);
                    const encodedToken = Buffer.from(token).toString('base64');
                    const cookieValue = `jwtSignUp=${encodedToken}; Path=/`;

                    const hasSignUpCookie = req.headers.cookie && req.headers.cookie.includes('jwtSignUp=');
                    const hasSignInCookie = req.headers.cookie && req.headers.cookie.includes('jwtSignIn=');
                    if (!(hasSignUpCookie || hasSignInCookie)) {
                        res.setHeader('Set-Cookie', cookieValue);
                    }

                    res.writeHead(302, {
                        Location: "../products/products.html"
                    });
                    const insertedUserId = await insertUser(username, email, res);
                    const success = await insertHashedPassword(insertedUserId, hashedPassword);
                    res.end();

                } catch (error) {
                    console.error('Error inserting user:', error);
                    res.writeHead(400, { 'Location': '../' });
                    res.end(JSON.stringify({ message: 'Username or email already exists.' }));
                }
            }
            else {

                res.writeHead(400, { 'Location': '../' });
                res.end(JSON.stringify({ message: 'Passwords do not match' }));
                //res.write("Passwords do not match!");
                res.end();
            }
        });
    } catch (error) {
        console.error(error);
        res.write("Username already exists!");
        res.end();
    }
};






export { handleSignUpPost };

