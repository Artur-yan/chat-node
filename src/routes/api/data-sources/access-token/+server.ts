import { CB_TOKEN } from '$env/static/private';

export const POST = async ({ request, locals }) => {
	console.log('route hit');
	const { bot_id } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		const options = {
			method: 'GET',
			headers: { authorization: `Bearer ${CB_TOKEN}`, 'customer-id': bot_id }
		};

		const response = await fetch('https://api.carbon.ai/auth/v1/access_token', options);
		const data = await response.json();
		const { access_token } = data;

		return new Response(JSON.stringify({ access_token }));
	}
};
