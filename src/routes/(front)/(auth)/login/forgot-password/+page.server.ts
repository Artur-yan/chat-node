import { sendPasswordReset } from '$lib/server/messenger';
import { prismaClient } from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

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
					email: email.toLowerCase().trim()
				},
				data: {
					verification_uuid: uuid
				}
			});

			sendPasswordReset(email, uuid);
		} catch (err) {
			console.error(err);
		}
		return {
			success: true,
			submitted: false
		};
	}
};
