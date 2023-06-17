import crypto from 'crypto';
import querystring from 'querystring';
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

            res.writeHead(302, { 'Location': '../' });
            res.end();
        });
    }
    catch (err) {
        console.log(err);
    }

};
export { handleSignInPost }
