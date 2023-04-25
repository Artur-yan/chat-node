import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';
import {sendConfirmationEmail} from '$lib/server/messenger';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/account/chatbots');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const promo = form.get('promo');

		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid input'
			});
		}
		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: email,
					password
				},
				attributes: {
					email
				}
			});
			let subscriptionData = {
				user_id: user.userId,
			}
			if (promo === 'beta_tester') {
				subscriptionData.plan = 1
				subscriptionData.max_bot = 5
				subscriptionData.max_msg = 2000
			}
			await prismaClient.subscriptions.create({
				data: subscriptionData
			});
			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);

			await sendConfirmationEmail(email, user.userId);

		} catch (error) {
			console.error(error)
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				error.message?.includes('email')
			) {
				return fail(400, {
					message: 'Email already in use'
				});
			}
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return fail(400, {
					message: 'Username already in use'
				});
			}
			return fail(500, {
				message: 'Unknown error occurred'
			});
		}
	}
};
