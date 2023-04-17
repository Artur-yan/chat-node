import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const PUT = async ({ request, locals }) => {
	const { plan } = await request.json();
	const session = await locals.auth.validate();

	try {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				user_id: session.userId,
				plan: plan
			}
		});
	} catch (err) {
		return new Response('Error updating plan', { status: 500 });
	}

	return new Response();
};
