import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/account/chatbots');
	return {};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');

		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				submitted: false,
				message: 'Invalid input'
			});
		}

		try {
			console.log(auth)
			const key = await auth.useKey('username', email.toLowerCase(), password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (error) {
			if (
				error instanceof LuciaError &&
				(error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					submitted: false,
					error: true,
					message: 'Incorrect email or password'
				});
			}
			// database connection error
			console.error(error);
			return fail(500, {
				submitted: false,
				error: true,
				message: 'Unknown error occurred'
			});
		}
	}
};
