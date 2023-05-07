import type { LayoutServerLoad } from './settings/plan/$typesypes';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.auth.validateUser();

	if (user.session) {
		return { user };
	} else {
		throw redirect(303, '/login');
	}
};
