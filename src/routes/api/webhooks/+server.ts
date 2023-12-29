import { prismaClient } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	const { botId } = await request.json();

	try {
		const createdWebhook = await prismaClient.webhook.create({
			data: {
				bot_id: botId,
				type: 'LEADS',
				webhook_url: ''
			}
		});

		return new Response(JSON.stringify({ status: 200 }));
	} catch (error) {
		return new Response(JSON.stringify({ status: 400 }));
	}
}

export async function PATCH({ request }) {
	const { id, type, savedUrl, newUrl } = await request.json();
	try {
		const updatedWebhook = await prismaClient.webhook.update({
			where: {
				bot_id_type_webhook_url: {
					bot_id: id,
					type: type,
					webhook_url: savedUrl
				}
			},
			data: {
				webhook_url: newUrl
			}
		});

		return new Response(JSON.stringify({ status: 200 }));
	} catch (error) {
		return new Response(JSON.stringify({ status: 400 }));
	}
}

export async function DELETE({ request }) {
	const { id, type, url } = await request.json();
	try {
		await prismaClient.webhook.deleteMany({
			where: {
				bot_id: id,
				type,
				webhook_url: url
			}
		});

		return new Response(JSON.stringify({ status: 200 }));
	} catch (error) {
		return new Response(JSON.stringify({ status: 400 }));
	}
}
