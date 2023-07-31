export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return;

	try {
		return { session };
	} catch (err) {
		console.error(err);
	}
};
