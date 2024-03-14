import { PUBLIC_ENVIRONMENT, PUBLIC_LANDING_PAGE_URL } from '$env/static/public';
import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, PUBLIC_LANDING_PAGE_URL);
	} else {
		try {
			await auth.invalidateSession(session.sessionId);
		} catch (e) {
			console.error(e);
		}
	}

	if (PUBLIC_ENVIRONMENT === 'dev' || PUBLIC_ENVIRONMENT === 'preview') {
		throw redirect(302, '/login');
	} else {
		throw redirect(302, PUBLIC_LANDING_PAGE_URL);
	}
};
