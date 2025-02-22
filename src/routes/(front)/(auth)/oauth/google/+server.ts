import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

export const GET = async ({ url }) => {
	const plan = url.searchParams.get('plan') || '-1';
	const configs = {
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		redirectUri: `${PUBLIC_SITE_URL}/oauth/redirect-google`,
		scope: ['email']
	};

	const googleAuth = google(auth, configs);

	const googleUrl = await googleAuth.getAuthorizationUrl();
	const urlString = googleUrl[0].href;
	const newUrl = new URL(urlString);
	newUrl.searchParams.set('state', plan);

	return new Response(null, {
		status: 302,
		headers: {
			location: newUrl.toString()
		}
	});
};
