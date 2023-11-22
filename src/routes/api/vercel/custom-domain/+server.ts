import { VERCEL_BEARER_TOKEN } from '$env/static/private'
import { prismaClient } from '$lib/server/prisma';

export const POST = async  ({ request }) => {
    const { domain, botId } = await request.json();
    const res = await fetch("https://api.vercel.com/v10/projects/prj_YBmgo66tTQhX0pQE43qC5Hn8YKht/domains?teamId=team_Mr7OQlTcqwxCNceTx7QJ62LZ", {
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
    const res = await fetch(`https://api.vercel.com/v9/projects/prj_YBmgo66tTQhX0pQE43qC5Hn8YKht/domains/${domain}?teamId=team_Mr7OQlTcqwxCNceTx7QJ62LZ`, {
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