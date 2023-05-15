import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
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
			setHeaders({
				'Content-Security-Policy': `frame-ancestors 'self'`
			});
		}
		return { bot };
	} catch (err) {
		if (err.code == 'P2025') {
			throw error(400, 'Bot not found');
		} else {
			throw error(500, 'Unknown error occurred');
		}
	}
};
