import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate();

	try {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/create-customer-portal-session`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: session.userId,
			})
		});
		const { url } = await res.json()
		return new Response(JSON.stringify(url), { status: 200 })
		
	} catch (err) {
		return new Response('There was an error', { status: 500 });
	}
};