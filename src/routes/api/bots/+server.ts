import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const PUT = async ({ request, locals }) => {

    const { id, data_source_type } = await request.json();

	const session = await locals.auth.validate();
    
    const newBot = await prisma.bots.create({
        data: {
            id,
            user_id: session.userId,
            data_source_type
        }
    })


    return new Response();
};