import { prismaClient } from '$lib/server/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendAccountEmailUpdateConfirmation } from '$lib/server/messenger';

export const POST = async ({ locals, request }) => {
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

		sendAccountEmailUpdateConfirmation(newEmail, uuid);
	} catch (err) {
		if (err.code === 'P2002' && err.message?.includes('email')) {
			console.log('Email already exists');
		}
		console.error(err);
	}

	return new Response();
};
