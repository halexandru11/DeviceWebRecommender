import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { getUserDetailsByEmail } from './getUserDetailsByEmail.js';
import { generatePasswordForEmail } from './generatePasswordForEmail.js';
import path from 'path';
import fs from 'fs';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '0607andreea.ro@gmail.com',
        pass: 'cagjoykdlhtjnlwi'
    }
});

export const sendPasswordEmail = async (email) => {
    try {
        const userDetails = await getUserDetailsByEmail(email);

        if (!userDetails) {
            console.log('User does not exist.');
            return;
        }

        let userId = userDetails[0].id;
        let username = userDetails[0].username;

        let randomNumber = Math.floor(Math.random() * 100);
        let combinedString = `${username}${randomNumber}`;
        let hashedUsername = crypto.createHash('sha256').update(combinedString).digest('hex');

        let password = await generatePasswordForEmail(userId, hashedUsername);


        /*if (!password) {
            console.log('Password not found.');
            username = 'alabala';//
            email = '0607andreea.ro@gmail.com';//
            //return;
        }*/

        const csvContent = `User Email,Username,Password\n${email},${username},${password}`;

        const fileName = 'data.csv';
        console.log(fileName);

        const filePath = path.join('./', fileName);

        await fs.promises.writeFile(filePath, csvContent);

        const mailOptions = {

            from: '0607andreea.ro@gmail.com',
            to: email,
            subject: 'Gimme Account Password',
            text: 'Dear client,\n\nThis is a CSV file with your registration details.\n\nRegards,\nThe Gimme Team',
            attachments: [
                {
                    filename: 'data.csv',
                    path: filePath
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Password email sent:', info.response);
            }
        });
    } catch (error) {
        console.error(error);
    }
};