import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { prismaClient } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { PUBLIC_CHAT_API_URL } from '$env/static/public';
import { v4 as uuidv4 } from 'uuid';
import { sendAccountEmailConfirmation } from '$lib/server/messenger';

const configs = {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: `${PUBLIC_SITE_URL}/oauth/redirect-google`,
	scope: ['email']
};

export const GET = async ({ url, locals }) => {
	const code = url.searchParams.get('code') as string;
	const encryptedPlan = url.searchParams.get('plan') as string;

	const googleAuth = google(auth, configs);
	const GoogleUserAuth = await googleAuth.validateCallback(code);
	console.log(GoogleUserAuth);

	const urlData = await googleAuth.getAuthorizationUrl();

	const { email } = GoogleUserAuth.googleUser;

	throw redirect(302, '/account/chatbots');
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

		const regularPlans: any = {
			'-1': {
				plan: -1,
				max_bot: 1,
				max_msg: 50,
				max_tocken: 100000
			},
			'5': {
				plan: 5,
				max_bot: 3,
				max_msg: 5000,
				max_tocken: 500000
			},
			'6': {
				plan: 6,
				max_bot: 5,
				max_msg: 10000,
				max_tocken: 1000000
			},
			'105': {
				plan: 105,
				max_bot: 3,
				max_msg: 5000,
				max_tocken: 500000
			},
			'106': {
				plan: 106,
				max_bot: 5,
				max_msg: 10000,
				max_tocken: 1000000
			}
		};

		let subscriptionData = {
			user_id: user.userId,
			plan: regularPlans[plan].plan,
			max_bot: regularPlans[plan].max_bot,
			max_msg: regularPlans[plan].max_msg,
			max_tocken: regularPlans[plan].max_tocken
		};

		await prismaClient.subscriptions.create({
			data: subscriptionData
		});

		// Updating plan to selected plan
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: user.userId,
				plan: plan
			})
		});

		const data = await res.json();
		const stripeLink = data.url;

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		const sessionCookie = auth.createSessionCookie(session);

		locals.auth.setSession(session);
		throw redirect(302, stripeLink);
	}

	const session = await auth.createSession({ userId: user.id, attributes: {} });

	locals.auth.setSession(session);

	throw redirect(302, '/account/chatbots');
};
