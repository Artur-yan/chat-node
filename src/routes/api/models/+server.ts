import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ locals, request }) => {
	const { id, name, settings } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		await prismaClient.bots.create({
			data: {
				id,
				user_id: session.userId,
				data_source_type: 'text',
				name,
				settings
			}
		});
		return new Response(JSON.stringify({ status: 200 }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};

export const PATCH = async ({ request, locals }) => {
	const { id, name, settings } = await request.json();
	const session = await locals.auth.validate();

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.userId
		}
	})

	if (subscription?.plan === 0 && settings.gptVersion === '4') {
		settings.gptVersion = '3.5';
	} 

	if (session) {
		await prismaClient.bots.updateMany({
			where: {
				id,
				user_id: session.userId
			},
			data: {
				name,
				settings
			}
		});
		return new Response(JSON.stringify({ status: 200 }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};

export const DELETE = async ({ request, locals }) => {
	const { id } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		await prismaClient.bots.deleteMany({
			where: {
				id,
				user_id: session.userId
			}
		});
		return new Response(JSON.stringify({ status: 200 }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
