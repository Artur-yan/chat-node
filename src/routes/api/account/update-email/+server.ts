import type { RequestHandler } from './$types';
import {sendConfirmationEmail} from '$lib/server/messenger';

export const POST: RequestHandler = async ({ locals, request }) => {
    const { user } = await locals.auth.validateUser();
    const { email } = await request.json();

    sendConfirmationEmail(email, user.userId);
    
    return new Response();
};