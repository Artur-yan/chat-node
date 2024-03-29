import { SUPPORT_PASSCODE } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
let prismaClient = new PrismaClient();

export const GET = async ({ url }) => {
	const passcode = url.searchParams.get('passcode') as string;

	if (passcode !== SUPPORT_PASSCODE) {
		return json({ error: 'Invalid passcode' });
	}

	const email = url.searchParams.get('email') as string;

	if (!email) {
		return json({ error: 'Email is required' });
	}

	const user = await prismaClient.authUser.findMany({
		where: {
			email: email
		}
	});

	if (user.length === 0) {
		return json({ error: 'User not found' });
	}

	return json({ user });
};
