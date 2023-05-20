import { EMAIL_SERVER, EMAIL_ADDRESS, EMAIL_PASSWORD } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { prismaClient } from '$lib/server/prisma';

let transporter = nodemailer.createTransport({
	host: EMAIL_SERVER,
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_ADDRESS,
		pass: EMAIL_PASSWORD
	}
});

const sendConfirmationEmail = async (email: string) => {
	const uuid = uuidv4();
	await prismaClient.authUser.update({
		where: {
			email: email
		},
		data: {
			verification_uuid: uuid
		}
	});
	transporter.sendMail({
		from: EMAIL_ADDRESS,
		to: email,
		subject: 'Email Confirmation Required',
		text: `To confirm your email, please click this link: ${PUBLIC_SITE_URL}/account/confirm/${uuid}`
	});
};

export { sendConfirmationEmail, transporter };
