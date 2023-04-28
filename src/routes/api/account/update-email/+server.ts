import type { RequestHandler } from './$types';
import { prismaClient } from '$lib/server/prisma';
import { transporter} from "$lib/server/messenger"
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = async ({ locals, request }) => {
    const { user } = await locals.auth.validateUser();
    const { newEmail } = await request.json();
    const uuid = uuidv4();

    prismaClient.authUser.update({
        where: {
            id: user.id
        },
        data: {
            new_email: newEmail,
            verification_uuid: uuid
        }
    });

    transporter.sendMail({
      from: "contact@gptchatbot.ai",
      to: newEmail,
      subject : "Email Confirmation Required",
      text: `To confirm your email, please click this link: ${PUBLIC_SITE_URL}/account/confirm/${uuid}`,
    })
    
    return new Response();
};