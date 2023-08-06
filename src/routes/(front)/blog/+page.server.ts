export const load = async () => {

    const data = await fetch('http://cms.chatnode.ai/api/content/items/post', {
        method: 'GET',
        headers: {
            'api-key': 'API-0abe8486ae9683f1dfd7fe8565ee10cf82dddea2'
        }
    })
    const posts = await data.json()

    return {
        posts
    }
}