import { VERCEL_BEARER_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID } from '$env/static/private'

export const POST = async  ({ request }) => {
    const { domain } = await request.json();
    const res1 = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?teamId=${VERCEL_TEAM_ID}`, {
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        }
    })
    const res2 = await fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=${VERCEL_TEAM_ID}`, {
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        }
    })


    const data = await res1.json();
    const { misconfigured } = await res2.json();

    
    return new Response(JSON.stringify({
        ...data,
        misconfigured
    }))
}
