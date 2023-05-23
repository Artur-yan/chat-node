import type { RequestHandler } from './$types';
import { auth } from '$lib/server/lucia';
import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';


export const GET: RequestHandler = async ({ params, url, locals }) => {
	let update = url.searchParams.get('update');

	// For Existing Users
	if (update === 'true') {
		try {
			const user = await prismaClient.authUser.findFirstOrThrow({
				where: {
					verification_uuid: params.uuid
				}
			});

			// Update username
			await prismaClient.authKey.update({
				where: {
					user_id: user.id
				},
				data: {
					id: 'username:' + user.new_email
				}
			});

			await auth.updateUserAttributes(user.id, {
				email: user.new_email,
				new_email: null,
				verification_uuid: null
			});

			// Re-initiate session
			await auth.invalidateAllUserSessions(user.id);
			const session = await auth.createSession(user.id);
			locals.auth.setSession(session);

			// Redirect
			throw redirect(302, `/account/settings`);
		} catch (err) {
			console.error(err);
			throw redirect(302, `/account/settings`);
		}
	}
	// For new Users
	else {
		await prismaClient.authUser.update({
			where: {
				verification_uuid: params.uuid
			},
			data: {
				status: 'active'
			}
		});
		throw redirect(302, `/account/chatbots`);
	}
};
