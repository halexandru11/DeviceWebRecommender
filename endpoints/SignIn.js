import querystring from 'querystring';
import bcrypt from 'bcrypt';

const handleSignInPost = async (req, res) => {
    try {
        let body = [];
        await new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', async () => {
                try {
                    body = Buffer.concat(body).toString();
                    const values = querystring.parse(body);
                    const password = values.password;
                    const username = values.username;

                    console.log('Username:', username);
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    console.log('Hashed password:', hashedPassword);
                    res.writeHead(302, { 'Location': '../pages/products/products.html' });
                    res.end();

                } catch (error) {
                    reject(error);
                }

            }).on('error', (error) => {
                reject(error);
            });

        });
    } catch (err) {
        console.log(err);
    }
};

export { handleSignInPost };
