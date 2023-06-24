import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const getusernameFromCookie = (req, res) => {
  const cookie = req.headers.cookie;
  if (!cookie) {
    return null; // Return null when no cookie is found
  }

  const tokenCookie = cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('jwt'));
  if (!tokenCookie) {
    return null; // Return null when no token cookie is found
  }

  const encodedToken = tokenCookie.split('=')[1];
  const token = Buffer.from(encodedToken, 'base64').toString('utf-8');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.name; // Retrieve the username from the decoded payload
    return username; // Return the username
  } catch (err) {
    return null; // Return null when the token verification fails
  }
};
