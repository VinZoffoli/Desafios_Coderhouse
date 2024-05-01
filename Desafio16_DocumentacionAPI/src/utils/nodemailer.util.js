import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendPasswordResetEmail = async (email, token) => {
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
        subject: 'Restablecimiento de contraseña',
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:3000/reset-password/${token}`,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Correo de restablecimiento de contraseña enviado a: ${email}`);
    } catch (error) {
        console.error('Error al enviar correo de restablecimiento de contraseña:', error);
    }
};

export default sendPasswordResetEmail;
