import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, setHeaders, locals }) => {
	const user = await locals.auth.validateUser();
	try {
		const bot = await prismaClient.bots.findUniqueOrThrow({
			where: {
				id: params.id
			}
		});
		// Set the Content-Security-Policy header to allow the embed to be loaded only on the whitelisted domains
		if (bot.settings.public) {
			setHeaders({
				'Content-Security-Policy': `frame-ancestors 'self' ${bot.settings.allowedUrls.join(' ')};`
			});
		} else {
			const user = await locals.auth.validateUser();
			if (!user.session) {
				throw error(403, 'You are not allowed to view this bot');
			}
			// setHeaders({
			// 	'Content-Security-Policy': `frame-ancestors 'self'`
			// });
		}
		return { bot };
	} catch (err) {
		if (err.code == 'P2025') {
			throw error(400, 'Bot not found');
		} else {
			console.error(err);
			throw error(err.status, err.body.message);
		}
	}
};
