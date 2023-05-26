<script>
    import { PUBLIC_CHAT_API_URL, PUBLIC_SITE_URL } from '$env/static/public';

    export let data;

    let loading = false
    const handleSubmit = async () => {
        loading = true
        const res = await fetch (`${PUBLIC_CHAT_API_URL}/stripe/install`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `user_id=${data.model.user_id}; bot_id=${data.model.id} Domain=${PUBLIC_SITE_URL}`,
            }
        })
        data = await res.json()
        console.log(data)
        loading = false
    }
</script>

<div class="container py-20 text-center">
    <button class="btn btn-primary" on:click={() => handleSubmit()} class:loading>Authorize Stripe</button>
</div>