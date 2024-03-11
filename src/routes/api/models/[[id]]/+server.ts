import { prismaClient } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();

	if (session) {
		const model = await prismaClient.bots.findUnique({
			where: {
				id: params.id
			}
		});

		if (session.user.userId == model.user_id) {
			return json(model);
		} else {
			return new Response(JSON.stringify({ status: 401 }));
		}
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};

export const POST = async ({ locals, request }) => {
	const { id, name, settings } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		await prismaClient.bots.create({
			data: {
				id,
				user_id: session.user.userId,
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

	// const subscription = await prismaClient.subscriptions.findUnique({
	// 	where: {
	// 		user_id: session.user.userId
	// 	}
	// });

	if (session) {
		await prismaClient.bots.updateMany({
			where: {
				id,
				user_id: session.user.userId
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

	if (session && id) {
		await prismaClient.bots.deleteMany({
			where: {
				id,
				user_id: session.user.userId
			}
		});
		return new Response(JSON.stringify({ status: 200 }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
