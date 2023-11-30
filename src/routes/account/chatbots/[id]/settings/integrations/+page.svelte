<script>
    import { currentBot } from '$lib/stores';
    import tiersMap from '$lib/data/tiers';
    import { PUBLIC_CHAT_API_URL } from '$env/static/public';
    import Modal from '$lib/components/Modal.svelte';

    export let data;

</script>

<div>
    <div class="card card-compact bg-neutral mb-4">
        <div class="card-body">
            <h2 class="card-title">Crisp <span class="badge badge-accent badge-xs">New</span></h2>
            <p class="text-base text-neutral-content">
                Let your customers talk to a real person when your chatbot can't answer their questions.
            </p>
            <div>
                <div class="form-control">
                    <label class="cursor-pointer label justify-start gap-4">
                        <span class="label-text">OFF</span>
                        <input
                        type="checkbox"
                        class="toggle"
                        class:toggle-success={$currentBot.settings.crispEnabled}
                        bind:checked={$currentBot.settings.crispEnabled}
                        />
                        <span class="label-text">ON</span>
                    </label>
                    
                    {#if $currentBot.settings.crispEnabled}
                        <div class="grid lg:grid-cols-2 lg:gap-2">
                            <div>
                                <label class="label" for="crisp-website-id">Crisp Website ID</label>
                                <input
                                name="crisp-website-id"
                                class="input w-full"
                                type="text"
                                bind:value={$currentBot.settings.crispWebsiteId}
                                />
                                <div>
                                    <button class="btn btn-xs mt-2" on:click={() => crispInstructions.showModal()}>How to obtain your website ID</button>
                                </div>
                            </div>
                            <div>
                                <label class="label" for="crisp-button-text">Button Text</label>
                                <input
                                name="crisp-button-text"
                                class="input w-full"
                                type="text"
                                bind:value={$currentBot.settings.crispButtonText}
                                />
                            </div>
                        </div>

                    {/if}
                </div>
            </div>
    
        </div>
    </div>
</div>

<div>
    <div class="card card-compact bg-neutral">
        <div class="card-body">
            <h2 class="card-title">Slack</h2>
            <p class="text-base text-neutral-content">
                Get responses from your custom trained chatbot directly in slack for you and your team.
            </p>
            <div class="card-actions justify-between mt-10 items-center">
                {#if tiersMap[data.subscription.plan].features.slack.included}
                    {#if data.model.slack_bot_status === false}
                        <a class="btn btn-primary" href="{PUBLIC_CHAT_API_URL}/slack/install">
                            Authorize Slack
                        </a>
                    {:else}
                        <div class="badge badge-outline badge-success">Enabled</div>
                        <a class="btn btn-xs" href="{PUBLIC_CHAT_API_URL}/slack/install">
                            + Slack Workspace
                        </a>
                    {/if}
                {:else}
                    <p class="text-warning text-sm">
                        Slack integration is available on the pro plan and above
                    </p>
                    <a class="btn btn-warning" href="/account/settings/subscription">Upgrade</a>
                {/if}
            </div>
        </div>
    </div>
</div>

<Modal id="crispInstructions" title="How to obtain your crisp website ID">
    <ol>
        <li>Open your Crisp dashboard</li>
        <li>Click the settings ⚙️ icon at the bottom left</li>
        <li>Navigate to  'Website Settings' from the left-side list menu</li>
        <li>Click on the website you want to use</li>
        <li>Find 'Setup Instructions' then 'Website ID'</li>
    </ol>

	<svelte:fragment slot="actions">
		<button class="btn btn-outline">Got it!</button>
	</svelte:fragment>
</Modal>

<style>
    ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
    }
</style>