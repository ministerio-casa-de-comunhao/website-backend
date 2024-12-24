import nodemailer from 'nodemailer';

const sendEmail = (to, subject, text) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email',
                pass: 'app-pass'
            }
        });

        const mailOptions = {
            from: 'myEmail', 
            to: to,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

export default sendEmail;