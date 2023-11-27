<script>
    import { currentBot } from '$lib/stores';
</script>

<div>
    <h2 class="card-title">Crisp</h2>
    <div class="card bg-neutral">
        <div class="card-body">
            <p class="text-base text-neutral-content">
                Let your customers talk to real person when your chatbot can't answer their questions.
            </p>
            <div>
                <div class="form-control items-start">
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
                    </div>
            </div>
                <div>
                    <label class="label" for="crisp-website-id">Crisp Website ID</label>
                    <input
                        name="crisp-website-id"
                        class="input w-full"
                        type="text"
                        bind:value={$currentBot.settings.crispWebsiteId}
                    />
                </div>
    
        </div>
    </div>
</div>
