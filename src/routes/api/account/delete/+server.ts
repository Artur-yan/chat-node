import type { RequestHandler } from './$types';
import { auth } from '$lib/server/lucia';

export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		try {
			await auth.deleteUser(session.userId);
		} catch (err) {
			console.error(err);
		}
	}

	return new Response();
};
