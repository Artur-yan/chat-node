import { PUBLIC_CHAT_API_URL } from '$env/static/public';
import { prismaClient } from '$lib/server/prisma.js';

export const PUT = async ({ request, locals }) => {
	const { newPlan, referralCode, settings } = await request.json();
	const session = await locals.auth.validate();

	try {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: session.userId,
				plan: newPlan,
				referral: referralCode
			})
		});
		const url = await res.json();
		if (newPlan === 0) {
			settings.gptVersion = '3.5';
			prismaClient.bots.updateMany({
				where: {
					user_id: session.userId
				},
				data: {
					settings
				}
			})
		}
		return new Response(JSON.stringify(url), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response('There was an error', { status: 500 });
	}
};
