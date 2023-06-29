import { sendConfirmationEmail } from "$lib/server/messenger"

export const POST = async ({request}) => {
    const { email } = await request.json();
    sendConfirmationEmail(email)
    return new Response(JSON.stringify({ status: 200 }));
}