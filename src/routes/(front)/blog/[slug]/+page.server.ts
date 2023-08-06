export const load = async ({params}) => {

    const data = await fetch(`http://cms.chatnode.ai/api/content/item/post?filter={slug:'${params.slug}'}`, {
        method: 'GET',
        headers: {
            'api-key': 'API-0abe8486ae9683f1dfd7fe8565ee10cf82dddea2'
        }

    })

    const post = await data.json()

    console.log(post)

    return {
        post
    }

}