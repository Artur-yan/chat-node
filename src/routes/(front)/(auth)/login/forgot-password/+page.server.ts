import { sendPasswordReset } from '$lib/server/messenger';
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

		try {
			const uuid = uuidv4();
			await prismaClient.authUser.update({
				where: {
					email: email.toLowerCase()
				},
				data: {
					verification_uuid: uuid
				}
			});

			sendPasswordReset(email, uuid);

			return {
				success: true,
				submitted: false
			};
		} catch (err) {
			console.error(err);
		}
	}
};
