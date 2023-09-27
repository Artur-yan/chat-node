import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const PUT = async ({ request, locals }) => {
	const { newPlan, referralCode } = await request.json();
	const session = await locals.auth.validate();

	const handleAddonRemoval = () => {
		for (const addonId of ['10001', '10002', '10003', '10004']) {
			try {
				const res = fetch(PUBLIC_CHAT_API_URL + '/api/update-addon', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						user_id: session?.userId,
						adds_on: addonId,
						qty: 0
					})
				});
			} catch (err) {
				console.error(err);
			}
		}
	};

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
		if (newPlan === 0) {
			handleAddonRemoval();
		}
		const url = await res.json();
		return new Response(JSON.stringify(url), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response('There was an error', { status: 500 });
	}
};
