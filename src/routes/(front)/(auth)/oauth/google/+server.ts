import { auth } from '$lib/server/lucia';
import { google } from '@lucia-auth/oauth/providers';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

const configs = {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: `${PUBLIC_SITE_URL}/oauth/redirect-google`,
	scope: ['email']
};

const googleAuth = google(auth, configs);

export const GET = async () => {
	const url = await googleAuth.getAuthorizationUrl();
	const urlString = url[0].href;

	return new Response(null, {
		status: 302,
		headers: {
			location: urlString
		}
	});
};
