import type { LayoutServerLoad } from './settings/plan/$typesypes';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.auth.validateUser();

	return { user };
};
