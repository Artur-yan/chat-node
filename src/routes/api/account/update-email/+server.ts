import type { RequestHandler } from './$types';
import { prismaClient } from '$lib/server/prisma';
import { transporter } from '$lib/server/messenger';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_SITE_URL, PUBLIC_EMAIL_ADDRESS } from '$env/static/public';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.auth.validateUser();
	const { newEmail } = await request.json();
	const uuid = uuidv4();

	try {
		await prismaClient.authUser.update({
			where: {
				id: user.userId
			},
			data: {
				new_email: newEmail,
				verification_uuid: uuid
			}
		});

		await transporter.sendMail({
			from: PUBLIC_EMAIL_ADDRESS,
			to: newEmail,
			subject: 'Email Change Confirmation Required',
			text: `To confirm your new email, please click this link: ${PUBLIC_SITE_URL}/account/confirm/${uuid}?update=true`
		});
	} catch (err) {
		console.error(err);
	}

	return new Response();
};
