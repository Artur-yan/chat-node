import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { prismaClient } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

const configs = {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: `http://localhost:5173/oauth/redirect`,
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

	if (!user) {
		throw redirect(302, '/register');
	}
	const session = await auth.createSession({ userId: user.id, attributes: {} });

	// @ts-ignore
	locals.auth.setSession(session);

	throw redirect(302, '/account/chatbots');
};
