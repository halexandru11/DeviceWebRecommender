import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = (req, res, callbackFilters) => {
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized access' }));
        return;
    }

    const tokenCookie = cookie.split(';').find((cookie) => cookie.trim().startsWith('jwt'));
    if (!tokenCookie) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized access. You have to Sign in/ Register first to access the filters page. ' }));
        return;
    }

    const encodedToken = tokenCookie.split('=')[1];
    const token = Buffer.from(encodedToken, 'base64').toString('utf-8');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized access. Invalid' }));
            return;
        }
        const { name: username } = decoded;
        req.username = username;
        console.log('Valid');
        callbackFilters(); // Proceed to the next handler if the user is AUTHORIZED
    });
};

