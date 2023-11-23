import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	} else {
		try {
			await auth.invalidateSession(session.sessionId);
		} catch (e) {
			console.error(e);
		}
	}

	throw redirect(302, '/');

};
