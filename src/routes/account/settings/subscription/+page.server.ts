import { prismaClient } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import tiersMap from '$lib/data/tiers.js';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return;

	try {
		return { session };
	} catch (err) {
		console.error(err);
	}
};

export const actions = {
	upgradeAppsumo: async ({ request, locals }) => {
		const user = await locals.auth.validate();

		const subscription = await prismaClient.subscriptions.findFirst({
			where: {
				user_id: user.userId
			}
		});

		const form = await request.formData();
		const appsumoCodes = form.get('appsumo-codes');

		let tooManyCodes = false;
		let codesAlreadyRedeemed = false;
		let codesDontExist = false;

		if (appsumoCodes) {
			const codes = appsumoCodes.split('\r\n');

			const validateCodes = async () => {
				if (codes.length > 5 - (subscription.plan - 1000)) {
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
				const newPlanId = subscription.plan + codes.length;

				await prismaClient.subscriptions.update({
					where: {
						user_id: user.userId
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
						redeemed_by: user.email
					}
				});

				return {
					success: true,
					message: 'Your codes have been redeemed successfully'
				};
				// let subscriptionLimits = tiersMap[plan]['appsumo' + codes.length.toString()]
			}
		}
	}
};
