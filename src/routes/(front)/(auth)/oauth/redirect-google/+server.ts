import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { prismaClient } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import { sendAccountEmailConfirmation } from '$lib/server/messenger';

const configs = {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: `http://localhost:5173/oauth/redirect-google`,
	scope: ['email']
};

export const GET = async ({ url, locals }) => {
	const code = url.searchParams.get('code') as string;
	const googleAuth = google(auth, configs);
	const GoogleUserAuth = await googleAuth.validateCallback(code);
	const { email } = GoogleUserAuth.googleUser;

	const user = await prismaClient.authUser.findUnique({
		where: { email }
	});

	// User not found
	if (!user) {
		console.log('User not found');
		const uuid = uuidv4();
		const user = await auth.createUser({
			key: {
				providerId: 'username',
				providerUserId: email.toLowerCase(),
				password: uuid
			},
			attributes: {
				email,
				verification_uuid: uuid
			}
		});

		const freePlan = {
			plan: 0,
			max_bot: 1,
			max_msg: 50,
			max_tocken: 100000
		};

		let subscriptionData = {
			user_id: user.userId,
			plan: freePlan.plan,
			max_bot: freePlan.max_bot,
			max_msg: freePlan.max_msg,
			max_tocken: freePlan.max_tocken
		};

		await prismaClient.subscriptions.create({
			data: subscriptionData
		});

		await sendAccountEmailConfirmation(email, uuid);

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		const sessionCookie = auth.createSessionCookie(session);

		locals.auth.setSession(session);
		throw redirect(302, '/account/chatbots');
	}

	const session = await auth.createSession({ userId: user.id, attributes: {} });

	locals.auth.setSession(session);

	throw redirect(302, '/account/chatbots');
};
