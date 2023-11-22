import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/login');
	} else if (session.user.status !== 'active') {
		throw redirect(302, '/account/chatbots');
	}
};
