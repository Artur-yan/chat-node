import type { RequestHandler } from './$types';
import fbEvent from '$lib/server/fb';

export const POST: RequestHandler = async ({ request }) => {
	const { event, emails, amountSpent } = await request.json();

	fbEvent(event, emails, amountSpent);

	return new Response();
};
