import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import tiersMap from '$lib/data/tiers';

import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, setHeaders, locals }) => {
	const user = await locals.auth.validateUser();
	let removeBranding = false
	try {
		const bot = await prismaClient.bots.findUniqueOrThrow({
			where: {
				id: params.id
			}
		});
		const subscription = await prismaClient.subscriptions.findUnique({
			where: {
				user_id: bot.user_id
			}
		});

		console.log(subscription)

		const plan = subscription?.plan?.toString()

		if(tiersMap[plan].features.remove_chatnode_branding.included || subscription?.free_no_branding) {
			removeBranding = true
		}

		
		
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
		return { bot, removeBranding };
	} catch (err) {
		if (err.code == 'P2025') {
			throw error(400, 'Bot not found');
		} else {
			console.error(err);
			throw error(err.status, err.body.message);
		}
	}
};
