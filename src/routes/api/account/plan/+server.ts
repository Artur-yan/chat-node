import { PUBLIC_CHAT_API_URL } from '$env/static/public';

export const PUT = async ({ request, locals }) => {
	const { plan } = await request.json();
    console.log(plan)

	const session = await locals.auth.validate();

    try {
        const res = await fetch(`${PUBLIC_CHAT_API_URL}/update-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                user_id: session.userId,
                plan
            }
        })
    } catch {
        return new Response('Error updating plan', { status: 500 });
    }

	// await prisma.bots.create({
	// 	data: {
	// 		id,
	// 		user_id: session.userId,
	// 		data_source_type,
	// 		name,
	// 		settings
	// 	}
	// });

	return new Response();
};