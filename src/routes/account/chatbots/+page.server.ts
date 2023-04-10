import type { PageServerLoad } from './$types';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const load: PageServerLoad = async ({ locals }) => {

	const session = await locals.auth.validate();

    const bots = await prisma.bots.findMany({
        where: {
          user_id: {
            equals: session.userId,
          },
        },
      })

    


    return { bots };
};