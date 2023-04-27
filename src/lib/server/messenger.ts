import { EMAIL_SERVER, EMAIL_ADDRESS, EMAIL_PASSWORD } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';

import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD
    },
});

const sendConfirmationEmail = async (email: string, token: string) => {
  transporter.sendMail({
    from: "contact@gptchatbot.ai",
    to : email,
    subject : "Please confirm your email",
    text: `Please confirm your email by clicking on the following link: ${PUBLIC_SITE_URL}/account/confirm/${token}`
  })
}

export { sendConfirmationEmail }