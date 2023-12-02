import { VERCEL_BEARER_TOKEN, VERCEL_TEAM_ID } from '$env/static/private'

export const POST = async  ({ request }) => {
    const { domain } = await request.json();
    const res = await fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=${VERCEL_TEAM_ID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        }
    })

    return res;
}