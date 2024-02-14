import { PUBLIC_LANDING_PAGE_URL } from '$env/static/public';
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

	throw redirect(302, PUBLIC_LANDING_PAGE_URL);
};
