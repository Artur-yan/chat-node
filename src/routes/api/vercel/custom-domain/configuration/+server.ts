import { VERCEL_BEARER_TOKEN } from '$env/static/private'

export const POST = async  ({ request }) => {
    // const user = await locals.auth.validateUser()
    const { domain } = await request.json();
    const res = await fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=team_Mr7OQlTcqwxCNceTx7QJ62LZ`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${VERCEL_BEARER_TOKEN}`
        }
    })

    return res;
}