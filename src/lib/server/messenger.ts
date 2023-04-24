import { EMAIL_ADDRESS, EMAIL_PASSWORD } from '$env/static/private';

import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    host: "gptchatbot.ai",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD
    },
});

const sendEmailConfirmation = async (email: string, token: string) => {
}