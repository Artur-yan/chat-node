import { auth } from '$lib/server/lucia';
import { prismaClient } from '$lib/server/prisma';
import { redirect, type Actions } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export async function GET({ locals, params }) {
	try {
		const user = await prismaClient.authUser.update({
			where: {
				verification_uuid: params.uuid
			},
			data: {
				verification_uuid: null
			}
		});
		const session = await auth.createSession(user.id);
		await locals.auth.setSession(session);
		throw redirect(302, '/account/settings');
	} catch (err) {
		console.error(err);
		throw redirect(302, '/login');
	}
}