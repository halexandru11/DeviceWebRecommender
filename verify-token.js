export const verifyToken = (req, res, next) => {
    const token = req.headers.cookie.split('=')[1];
    if (!token) {
        // No token found, handle unauthorized access
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized access' }));
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // Invalid token, handle unauthorized access
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized access' }));
            return;
        }

        // Valid token, set the decoded userId on the request object
        req.userId = decoded.userId;
        next(); // Proceed to the next handler
    });
};