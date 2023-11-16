import { PUBLIC_ENVIRONMENT } from '$env/static/public';

import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

let i = 0;

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (PUBLIC_ENVIRONMENT !== 'production' && !session && event.url.pathname !== '/login') {
		if (event.url.searchParams.get('pw') !== 'f8g4t9grn4t94gbv9g3bi34g9hg') {
			throw redirect(303, '/login');
		}
	}

	return await resolve(event);
};
