import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '0607andreea.ro@gmail.com',
        pass: 'cagjoykdlhtjnlwi'
    }
});

export const sendConfirmationEmail = (email, username) => {
    const mailOptions = {
        from: '0607andreea.ro@gmail.com',
        to: email,
        subject: 'Account Confirmation',
        text: 'Dear client,\n\nThank you for registering an account. Your account has been successfully created.\n\nRegards,\nThe Gimme Team'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Confirmation email sent:', info.response);
        }
    });
};
