import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { prismaClient } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { PUBLIC_CHAT_API_URL } from '$env/static/public';
import Plausible from 'plausible-tracker';
import { PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';
import { v4 as uuidv4 } from 'uuid';

export const GET = async ({ url, locals }) => {
	const configs = {
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		redirectUri: `${PUBLIC_SITE_URL}/oauth/redirect-google`,
		scope: ['email']
	};

	const code = url.searchParams.get('code') as string;
	const plan = url.searchParams.get('state') || '-1';

	const googleAuth = google(auth, configs);
	const GoogleUserAuth = await googleAuth.validateCallback(code);
	const { email } = GoogleUserAuth.googleUser as any;

	// Check if user already exists
	const user = await prismaClient.authUser.findUnique({
		where: { email }
	});

	// Redirect existing user to chatbots page
	if (user) {
		const session = await auth.createSession({
			userId: user.id,
			attributes: {}
		});

		const sessionCookie = auth.createSessionCookie(session);
		locals.auth.setSession(session);
		throw redirect(302, '/account/chatbots');
	}

	// User not found
	const uuid = uuidv4() as string;
	const newUser = await auth.createUser({
		key: {
			providerId: 'username',
			providerUserId: email.toLowerCase(),
			password: uuid
		},
		attributes: {
			email,
			verification_uuid: uuid,
			status: 'active'
		}
	});

	// Tracking for Plausible and GTM
	const { trackEvent } = Plausible({
		domain: PUBLIC_PLAUSIBLE_DOMAIN,
		apiHost: PUBLIC_PLAUSIBLE_API_HOST
	});
	trackEvent('Signup');
	dataLayer.push({
		event: 'Signup'
	});

	const regularPlans: any = {
		free: {
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
		user_id: newUser.userId,
		plan: regularPlans['free'].plan,
		max_bot: regularPlans['free'].max_bot,
		max_msg: regularPlans['free'].max_msg,
		max_tocken: regularPlans['free'].max_tocken
	};

	await prismaClient.subscriptions.create({
		data: subscriptionData
	});

	// Create Stripe User
	const stripeUser = await fetch(`${PUBLIC_CHAT_API_URL}/create-stripe-user`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer sk-868f7d2e-9e8c-4a2f-ab70-757c9d04ccfb`
		},
		body: JSON.stringify({
			record: {
				id: newUser.userId,
				email: email
			}
		})
	});

	const session = await auth.createSession({
		userId: newUser.userId,
		attributes: {}
	});

	const sessionCookie = auth.createSessionCookie(session);
	locals.auth.setSession(session);

	// Updating plan to selected plan if plan is specified
	if (plan === '-1') {
		throw redirect(302, '/account/settings/subscription');
	} else {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: newUser.userId,
				plan: plan
			})
		});

		const data = await res.json();
		const stripeLink = data.url;
		throw redirect(302, stripeLink);
	}
};
