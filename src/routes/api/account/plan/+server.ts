import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const PUT = async ({ request, locals }) => {
	const { newPlan, referralCode } = await request.json();
	const session = await locals.auth.validate();

	try {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: session?.userId,
				plan: newPlan,
				referral: referralCode
			})
		});
		const url = await res.json();
		return new Response(JSON.stringify(url), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response('There was an error', { status: 500 });
	}
};
