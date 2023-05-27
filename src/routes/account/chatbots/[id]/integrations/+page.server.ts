import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const load = async ({ cookies, locals, params }) => {
    const user = await locals.auth.validateUser();

	const user_id = cookies.set('user_id', user.user?.userId, { path: '/', domain: PUBLIC_CHAT_API_URL });
	const bot_id = cookies.set('bot_id', params.id, { path: '/', domain: PUBLIC_CHAT_API_URL });

	return {
		user_id,
        bot_id
	};
}