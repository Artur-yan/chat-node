import { CMS_API_KEY, RAAFT_KEY } from '$env/static/private';
import { PUBLIC_CMS_PATH } from '$env/static/public';
import { prismaClient } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import tiersMap from '$lib/data/tiers.js';
import * as crypto from "crypto";


async function fetchRaaft(subscription_id: any | undefined) {
	if (subscription_id === null || subscription_id === "") {
		return ""
	} else {
		return crypto.createHmac(
			 'sha256',
			 RAAFT_KEY
		).update(subscription_id).digest('hex');
	}
}

async function fetchTestimonials() {
	const testimonials = await fetch(`${PUBLIC_CMS_PATH}/api/content/tree/testimonials`, {
		method: 'GET',
		headers: {
			'api-key': CMS_API_KEY
		}
	});
	return await testimonials.json();
}

export const load = async ({ locals, setHeaders }) => {
	const session = await locals.auth.validate();
	if (!session) return;
	const subscription = await prismaClient.subscriptions.findFirst({
			where: {
				user_id: session.user.userId
			}
		});
	const sub_id = subscription.stripe_subscription
	const raaft_key = await fetchRaaft(sub_id)

	setHeaders({
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		Pragma: 'no-cache',
		Expires: '0'
	});

	try {
		return {
			session,
			streamed: {
				testimonials: fetchTestimonials()
			},
			raaft_key
		};
	} catch (err) {
		console.error(err);
	}
};

export const actions = {
	upgradeAppsumo: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		const subscription = await prismaClient.subscriptions.findFirst({
			where: {
				user_id: session.user.userId
			}
		});

		const form = await request.formData();
		const appsumoCodes = form.get('appsumo-codes');
		const email = form.get('email');

		let tooManyCodes = false;
		let codesAlreadyRedeemed = false;
		let codesDontExist = false;

		if (appsumoCodes) {
			const codes = appsumoCodes.split('\r\n');

			const validateCodes = async () => {
				if (codes.length > 7 - (subscription.plan - 1000)) {
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
					success: false,
					message:
						'One or more of your codes is invalid. It is either incorrect or has already been redeemed.'
				});
			} else if (tooManyCodes) {
				return fail(400, {
					success: false,
					message: 'Maxiumum # of codes exceeded'
				});
			} else {
				// Success
				let newPlanId;
				if (subscription.plan > 1000) {
					newPlanId = subscription.plan + codes.length;
				} else if (subscription.plan === 0 || subscription.plan === -1) {
					newPlanId = 1000 + codes.length;
				} else {
					return;
				}

				await prismaClient.subscriptions.update({
					where: {
						user_id: session.user.userId
					},
					data: {
						plan: newPlanId,
						max_bot: tiersMap[newPlanId].max_bot,
						max_msg: tiersMap[newPlanId].max_msg,
						max_tocken: tiersMap[newPlanId].max_tocken
					}
				});

				const matchingCodes = await prismaClient.appSumoCodes.updateMany({
					where: {
						code: { in: codes }
					},
					data: {
						redeemed: true,
						redeemed_date: new Date(),
						redeemed_by: email
					}
				});

				return {
					success: true,
					message: 'Your codes have been redeemed successfully'
				};
			}
		}
	}
};