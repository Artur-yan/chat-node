import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const PUT = async ({ request }) => {

    const { id, data_source_type } = await request.json();
    
    const newBot = await prisma.bots.create({
        data: {
            id,
            data_source_type
        }
    })


    return new Response();
};