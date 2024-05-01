import dotenv from 'dotenv';
dotenv.config();

const email = {
    identifier: process.env.EMAIL_IDENTIFIER,
    password: process.env.EMAIL_PASSWORD,
};

const sms = {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAccountToken: process.env.TWILIO_ACCOUNT_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
};

export { email, sms };
