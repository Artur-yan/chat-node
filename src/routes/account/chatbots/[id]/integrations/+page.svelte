<script>
    import { PUBLIC_CHAT_API_URL } from '$env/static/public';

    export let data;
    console.log(data);
</script>

<div class="container py-20 text-center">
    <a class="btn btn-primary" href="{PUBLIC_CHAT_API_URL}/stripe/install/{data.model.user_id}/{data.model.id}/">Authorize Stripe</a>
</div>