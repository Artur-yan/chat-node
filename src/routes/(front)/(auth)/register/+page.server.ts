import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';
import { sendAccountEmailConfirmation } from '$lib/server/messenger';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/account/chatbots');
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const appsumoCodes = form.get('appsumo-codes');
		const promo = url.searchParams.get('promo');

		const domainBlacklist = [
			'givmail.com',
			'givmail.io',
			'givmail.co',
			'inboxbear.com',
			'vomoto.com'
		];

		if (domainBlacklist.includes(email.split('@')[1])) {
			return fail(400, {
				message: 'Invalid input',
				submitted: false
			});
		}

		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid input',
				submitted: false
			});
		}

		let tooManyCodes = false;
		let codesAlreadyRedeemed = false;
		let codesDontExist = false;

		if (appsumoCodes) {
			
			const validateCodes = async () => {
				const codes = appsumoCodes.split('\r\n');

				if(codes.length > 5) {
					tooManyCodes = true
					return
				}
					
				const matchingCodes = await prismaClient.appSumoCodes.findMany({
					where: {
						code: {in: codes }
					}
				})

				if (matchingCodes.length !== codes.length) {
					codesDontExist = true;
					return						
				}

				matchingCodes.forEach(code => {
					if(code.redeemed) {
						codesAlreadyRedeemed = true;
						return
					}
				})
			}
			await validateCodes()

			if (codesAlreadyRedeemed || codesDontExist) {
				return fail(400, {
					message: 'One or more of your codes is invalid. It is either incorrect or has already been redeemed.',
					submitted: false
				});
			} else if (tooManyCodes) {
				return fail(400, {
					message: 'Maxiumum of 5 codes allowed',
					submitted: false
				});
			}
		}




		try {			
			// Create User
			const uuid = uuidv4();
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: email,
					password
				},
				attributes: {
					email,
					verification_uuid: uuid
				}
			});

			// Create Subscription
			let subscriptionData = {
				user_id: user.userId
			};
			if (promo === 'beta_tester') {
				subscriptionData.plan = 1;
				subscriptionData.max_bot = 5;
				subscriptionData.max_msg = 2000;
			}
			await prismaClient.subscriptions.create({
				data: subscriptionData
			});

			// Send Email
			await sendAccountEmailConfirmation(email, uuid);

			// Start Session
			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch (error) {
			console.error(error);
			if (error.code === 'P2002' && error.message?.includes('email')) {
				return fail(400, {
					message: 'Email already in use'
				});
			}
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return fail(400, {
					message: 'Username already in use',
					submitted: false
				});
			}
			return fail(500, {
				message: 'Unknown error occurred',
				submitted: false
			});
		}

		throw redirect(302, '/account/chatbots?signup=success');
	}
};
