import { VERCEL_BEARER_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID } from '$env/static/private'
import { prismaClient } from '$lib/server/prisma';

export const POST = async  ({ request }) => {
    const { domain, botId } = await request.json();
    const res = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          name: domain,
        })
    })

    if(res.ok) {
        await prismaClient.bots.update({
            where: {
                id: botId
            },
            data: {
                custom_domain: domain
            }
        })
    }
    
    return res;
}

export const DELETE = async  ({ request }) => {
    const { domain, botId } = await request.json();
    const res = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?${VERCEL_TEAM_ID}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        }
    })

    if(res.ok) {
        await prismaClient.bots.update({
            where: {
                id: botId
            },
            data: {
                custom_domain: null
            }
        })
    }
    
    return res;
}