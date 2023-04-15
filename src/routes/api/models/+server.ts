import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const POST = async ({ request, locals }) => {
	const { id, data_source_type, name, settings } = await request.json();

	const session = await locals.auth.validate();

	await prisma.bots.create({
		data: {
			id,
			user_id: session.userId,
			data_source_type,
			name,
			settings
		}
	});

	return new Response();
};

export const PATCH = async ({ request, locals }) => {
	const { id, name, settings  } = await request.json();

	const session = await locals.auth.validate();

	await prisma.bots.update({
		where: {
			id
		},
		data: {
			name,
			settings
		}
	});

	return new Response();
};

export const DELETE = async ({ request, locals }) => {
	const { id  } = await request.json();

	const session = await locals.auth.validate();

	await prisma.bots.delete({
		where: {
			id
		}
	});

	return new Response();
};