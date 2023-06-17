import { sendConfirmationEmail } from '../emailService.js';
import querystring from 'querystring';

const handleSignUpPost = async (req, res) => {
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

            sendConfirmationEmail(email, username);
            res.writeHead(302, { 'Location': '../pages/products/products.html' });
            res.end();

        });
    }
    catch (err) {
        console.log(err);
    }
};

export { handleSignUpPost };
