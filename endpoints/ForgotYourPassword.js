import { sendPasswordEmail } from '../passwordService.js';
import querystring from 'querystring';
import crypto from 'crypto';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const handleForgotPassword = async (req, res) => {
    try {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            body = Buffer.concat(body).toString();
            let values = querystring.parse(body);
            const email_resend = values.email_resend;
            await sendPasswordEmail(email_resend);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        });
    } catch (error) {
        console.error(error);
    }
};