import { PUBLIC_ENVIRONMENT } from '$env/static/public';

import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

let i = 0


export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = await auth.handleRequest(event);

	const { user } = await event.locals.auth.validateUser();


	if (PUBLIC_ENVIRONMENT !== 'production' && !user && event.url.pathname !== '/login') {
		if(event.url.searchParams.get('pw') !== 'f8g4t9grn4t94gbv9g3bi34g9hg') {
			console.log(event.url.searchParams.get('pw'))
			throw redirect(303, '/login');
		}
	}

	return await resolve(event);
};
