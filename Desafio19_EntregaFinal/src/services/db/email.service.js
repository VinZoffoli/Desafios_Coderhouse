import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (email, subject, text) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_IDENTIFIER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'vinzoffoli@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Correo enviado a: ${email}`);
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};

export default sendEmail;
