<script>
    import { PUBLIC_CHAT_API_URL } from '$env/static/public';

    export let data;

</script>

<div class="container pb-10 grid sm:grid-cols-2 md:grid-cols-3">
    <div class="card bg-base-300">
        <div class="card-body">
            <h2 class="card-title">Slack</h2>
            <p class="text-base text-neutral-content">
                Get responses from your custom trained chatbot directly in slack for you and your team.
            </p>
            <div class="card-actions justify-between mt-10 items-center">
                {#if data.model.slack_bot_status === true}
                    <a class="btn btn-primary" href="{PUBLIC_CHAT_API_URL}/slack/install">Authorize Slack</a>
                {:else}
                    <div class="badge badge-outline badge-success">Enabled</div>
                    <a class="btn btn-xs" href="{PUBLIC_CHAT_API_URL}/slack/install">+ Slack Workspace</a>
                {/if}
            </div>
        </div>
    </div>
</div>