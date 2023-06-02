import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ locals, request }) => {
	const { id } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		let bot = await prismaClient.bots.findUnique({
			where: {
				id
			}
		});
		// supabase
		// 	.channel('bot_status')
		// 	.on(
		// 		'postgres_changes',
		// 		{
		// 			event: 'UPDATE',
		// 			schema: 'public',
		// 			table: 'bots',
		// 			filter: `id=eq.${id}`
		// 		},
		// 		(payload) => {
		// 			botsInTraining.set(payload.old.id)
		// 			alert.set(payload.old.id)
		// 			console.log(payload)
		// 			// supabase.removeChannel('bot_status');
		// 		}
		// 	)
		// 	.subscribe()

		return new Response(JSON.stringify({ status: bot?.status }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
