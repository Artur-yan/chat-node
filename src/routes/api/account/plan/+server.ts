import { PUBLIC_CHAT_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {
	const { plan } = await request.json();
	const session = await locals.auth.validate();

	try {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: session.userId,
				plan: plan
			})
		});
		const { url } = await res.json()
		return new Response(JSON.stringify(url), { status: 200 })
		
	} catch (err) {
		return new Response('There was an error', { status: 500 });
	}
};
