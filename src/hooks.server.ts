import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	if(event.url.pathname.startsWith('/account')){
		if(!event.locals.auth){
			 throw redirect(303, '/login');
		}
	}
	
	return await resolve(event);
};
