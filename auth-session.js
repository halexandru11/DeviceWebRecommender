
/*const authUser = (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    const username = 'ana';
    const password = '123';

    if (sessionId) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            if (error) {
                console.error('Error validating session:', error);
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }

            if (results.length === 1) {
                const user = results[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                        return;
                    }

                    if (isMatch) {
                        next();
                    } else {
                        res.statusCode = 401;
                        res.end('Not authenticated');
                    }
                });
            } else {
                res.statusCode = 401;
                res.end('Not authenticated');
            }
        });
    } else {
        res.statusCode = 401;
        res.end('Not authenticated');
    }
};

export { authUser };
*/