export const load = async ({ cookies, locals, params }) => {
    const user = await locals.auth.validateUser();

	const user_id = cookies.set('user_id', user.user?.userId, { path: '/', domain: '.chatnode.ai' });
	const bot_id = cookies.set('bot_id', params.id, { path: '/' });

	return {
		user_id,
        bot_id
	};
}