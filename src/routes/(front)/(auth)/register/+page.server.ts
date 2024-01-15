import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { prismaClient } from '$lib/server/prisma';
import { sendAccountEmailConfirmation } from '$lib/server/messenger';
import { v4 as uuidv4 } from 'uuid';
import { domainBlacklist } from '$lib/systemSettings';
import type { PageServerLoad } from './$types';
import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/account/chatbots');
};

const regularPlans: any = {
	'5': {
		plan: 5,
		max_bot: 3,
		max_msg: 5000,
		max_tocken: 500000
	},
	'6': {
		plan: 6,
		max_bot: 5,
		max_msg: 10000,
		max_tocken: 1000000
	},
	'105': {
		plan: 105,
		max_bot: 3,
		max_msg: 5000,
		max_tocken: 500000
	},
	'106': {
		plan: 106,
		max_bot: 5,
		max_msg: 10000,
		max_tocken: 1000000
	}
};

const specialPlans: any = {
	// -1 as a default temporary plan
	free: {
		plan: -1,
		max_bot: 3,
		max_msg: 5000,
		max_tocken: 500000
	},
	appsumo1: {
		plan: 1001,
		max_bot: 10,
		max_msg: 2000,
		max_tocken: 500000
	},
	appsumo2: {
		plan: 1002,
		max_bot: 20,
		max_msg: 4000,
		max_tocken: 1000000
	},
	appsumo3: {
		plan: 1003,
		max_bot: 40,
		max_msg: 6000,
		max_tocken: 2000000
	},
	appsumo4: {
		plan: 1004,
		max_bot: 60,
		max_msg: 8000,
		max_tocken: 4000000
	},
	appsumo5: {
		plan: 1005,
		max_bot: 80,
		max_msg: 10000,
		max_tocken: 8000000
	}
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const appsumoCodes = form.get('appsumo-codes');
		const selectedPlan: string = url.searchParams.get('plan') || '5';

		let codes: Array<string> = [];

		let subscriptionLimits = specialPlans['free'];
		let tooManyCodes = false;
		let codesAlreadyRedeemed = false;
		let codesDontExist = false;
		let stripeLink: string;

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

		if (appsumoCodes) {
			codes = appsumoCodes.split('\r\n');
			const validateCodes = async () => {
				if (codes.length > 5) {
					tooManyCodes = true;
					return;
				}

				const matchingCodes = await prismaClient.appSumoCodes.findMany({
					where: {
						code: { in: codes }
					}
				});

				if (matchingCodes.length !== codes.length) {
					codesDontExist = true;
					return;
				}

				matchingCodes.forEach((code) => {
					if (code.redeemed) {
						codesAlreadyRedeemed = true;
						return;
					}
				});
			};
			await validateCodes();

			if (codesAlreadyRedeemed || codesDontExist) {
				return fail(400, {
					message:
						'One or more of your codes is invalid. It is either incorrect or has already been redeemed.',
					submitted: false
				});
			} else if (tooManyCodes) {
				return fail(400, {
					message: 'Maxiumum of 5 codes allowed',
					submitted: false
				});
			}

			subscriptionLimits = specialPlans['appsumo' + codes.length.toString()];
		}

		try {
			// Create User
			const uuid = uuidv4();
			const user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: email.toLowerCase(),
					password
				},
				attributes: {
					email,
					verification_uuid: uuid,
					status: 'pending'
				}
			});

			let subscriptionData = {
				user_id: user.userId,
				plan: subscriptionLimits.plan,
				max_bot: subscriptionLimits.max_bot,
				max_msg: subscriptionLimits.max_msg,
				max_tocken: subscriptionLimits.max_tocken
			};

			// Creating default free plan or appsumo plan
			await prismaClient.subscriptions.create({
				data: subscriptionData
			});

			// Creating Stripe User
			if (!appsumoCodes) {
				const stripeUser = await fetch(`${PUBLIC_CHAT_API_URL}/create-stripe-user`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer sk-868f7d2e-9e8c-4a2f-ab70-757c9d04ccfb`
					},
					body: JSON.stringify({
						record: {
							id: user.userId,
							email: email
						}
					})
				});

				// Updating plan to selected plan
				const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						user_id: user.userId,
						plan: selectedPlan
					})
				});

				const data = await res.json();
				stripeLink = data.url;
			}

			sendAccountEmailConfirmation(email, uuid);

			// fbEvent('StartTrial', [email]);

			// Start Session
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			const sessionCookie = auth.createSessionCookie(session);
			locals.auth.setSession(session);
		} catch (error) {
			console.error(
				'ERROR',
				error,
				'Email',
				email,
				'Apssumo Codes',
				codes,
				'Limits',
				subscriptionLimits
			);
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

		// // Update Codes
		if (appsumoCodes) {
			await prismaClient.appSumoCodes.updateMany({
				where: {
					code: { in: codes }
				},
				data: {
					redeemed: true,
					redeemed_date: new Date(),
					redeemed_by: email
				}
			});
			throw redirect(302, '/account/chatbots');
		}

		throw redirect(302, stripeLink);
	}
};
