import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const POST = async ({ locals, request }) => {
	const { id, name, settings } = await request.json();
	const session = await locals.auth.validate();

	if(session) {
		await prisma.bots.create({
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

	if(session) {
		await prisma.bots.updateMany({
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

	if(session) {
		await prisma.bots.deleteMany({
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
