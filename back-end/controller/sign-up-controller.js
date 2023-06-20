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
                    res.setHeader('Set-Cookie', cookieValue);

                    res.writeHead(302, {
                        Location: "../"
                    });
                    const insertedUserId = await insertUser(username, email, res);
                    const success = await insertHashedPassword(insertedUserId, hashedPassword);
                    res.end();

                } catch (error) {
                    console.error('Error inserting user:', error);
                    res.write('Username or email already exists.'); // Inform the user about the duplicate entry
                    res.end();
                }
            }
            else {
                res.write("Passwords do not match!");
                res.end();
            }
        });
    } catch (error) {
        console.error(error);
        res.write("Username already exists!");
        res.end();
    }
};

/*async function handleConfirmation(email, username, res) {
    try {
        const token = jwt.sign({ name: username }, process.env.ACCESS_TOKEN_SECRET);
        console.log('JWT:', token);
        const encodedToken = Buffer.from(token).toString('base64');
        const cookieValue = `jwtSignUp=${encodedToken}; Path=/`;
        //res.setHeader('Set-Cookie', cookieValue);
        res.writeHead(302, {
            Location: "../"
        });
        sendConfirmationEmail(email, username);
        res.end();
    } catch (error) {
        console.error('Error handling confirmation:', error);
        res.write('Error handling confirmation.');
        res.end();
    }
}*/





export { handleSignUpPost };

