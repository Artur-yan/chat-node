import { transporter } from '$lib/server/messenger';
import { prismaClient } from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_SITE_URL, PUBLIC_EMAIL_ADDRESS } from '$env/static/public';

let emailBody = '';
let emailSubject = '';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const email = form.get('email');
		if (!email || typeof email !== 'string') {
			return fail(400, {
				message: 'Invalid input'
			});
		}

		let user;

		try {
			const uuid = uuidv4();
			user = await prismaClient.authUser.update({
				where: {
					email
				},
				data: {
					verification_uuid: uuid
				}
			});
			emailSubject = 'Password Reset Request';
			emailBody = `We received a request to reset your password. If you didn't make this request, kindly disregard this email. To reset your password, follow this link: ${PUBLIC_SITE_URL}/reset-password/${uuid}`;
		} catch (err) {
			if (!user) {
				emailSubject = 'Account Not Found';
				emailBody = `We couldn't find an account associated with the email address provided (${email}). You can register for a new account at ${PUBLIC_SITE_URL}/register`;
			} else {
				console.error(err);
			}
		}

		await transporter.sendMail({
			from: PUBLIC_EMAIL_ADDRESS,
			to: email,
			subject: emailSubject,
			text: emailBody
		});

		return {
			success: true,
			submitted: false
		};
	}
};
