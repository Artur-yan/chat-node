import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

/**
 * If the user is not authenticated, it redirects to the home page.
 * If the user is transitioning from trial to active subscription, it redirects to a thank you page based on the subscription plan.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/');
	}

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.user.userId
		}
	});
    
	if (
		[5, 105, 6, 106].includes(subscription?.plan) &&
		subscription?.first_active_login === false && subscription?.status === "active" &&
		PUBLIC_ENVIRONMENT === 'production'
	) {
		await prismaClient.subscriptions.update({
			where: {
				id: session.user.userId
			},
			data: {
				first_active_login: true
			}
		});

		if (subscription?.plan === 5) {
			throw redirect(302, 'https://www.chatnode.ai/conversion/sm');
		} else if (subscription?.plan === 105) {
			throw redirect(302, 'https://www.chatnode.ai/conversion/sy');
		} else if (subscription?.plan === 6) {
			throw redirect(302, 'https://www.chatnode.ai/conversion/gm');
		} else if (subscription?.plan === 106) {
			throw redirect(302, 'https://www.chatnode.ai/conversion/gy');
		}
	}

	return { user, subscription };

	// if (subscription?.plan === -1) {
	// 	throw redirect(302, '/account/settings/subscription');
	// }
};
