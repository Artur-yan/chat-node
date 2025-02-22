import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const load = async ({ cookies, locals, params }) => {
	const session = await locals.auth.validate();


	const user_id = cookies.set('user_id', session.user.userId, { path: '/', domain: '.chatnode.ai' });
	const bot_id = cookies.set('bot_id', params.id, { path: '/', domain: '.chatnode.ai' });

	return {
		user_id,
		bot_id
	};
};
