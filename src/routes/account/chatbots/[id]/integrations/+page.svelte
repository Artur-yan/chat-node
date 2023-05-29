<script>
    import { PUBLIC_CHAT_API_URL } from '$env/static/public';

    export let data;

    console.log(data)

</script>

<div class="container pb-10 grid sm:grid-cols-2 md:grid-cols-3">
    <div class="card bg-base-300">
        <div class="card-body">
            <h2 class="card-title">Slack</h2>
            <p class="text-base text-neutral-content">
                Get responses from your custom trained chatbot directly in slack for you and your team.
            </p>
            {#if data.model.slack_bot_status === false}
                <a class="btn btn-primary mt-10" href="{PUBLIC_CHAT_API_URL}/slack/install">Authorize Slack</a>
            {:else}
                <div class="badge badge-outline badge-success mt-10">Enabled</div>
            {/if}
        </div>
    </div>
</div>