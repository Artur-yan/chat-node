<script>
    import { PUBLIC_CHAT_API_URL, PUBLIC_SITE_URL } from "$env/static/public";

    export let data;

    let loading = false
    const handleSubmit = async () => {
        // Redirect to a different website
        //window.location.href = `${PUBLIC_CHAT_API_URL}/slack/install`; I don't know why sometime it appends it, sometimes not to normal domain

        window.location.href = `https://api.dev.chatnode.ai/slack/install`;

        // loading = true
        // const res = await fetch (`${PUBLIC_CHAT_API_URL}/slack/install`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Set-Cookie': `user_id=${data.model.user_id}; bot_id=${data.model.id}`
        //     }
        // })
        // console.log(res)

        // if(res.status === 200){
        //     goto(`/account/chatbots/${data.model.id}/integrations/slack`, {

        //     })
        // }
    }
</script>

<div class="container py-20 text-center">
    <button class="btn btn-primary" on:click={() => handleSubmit()} class:loading>Authorize Slack</button>
</div>