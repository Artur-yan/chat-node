<script lang="ts">
    import { page } from '$app/stores';
    import Chat from '$lib/components/Chat.svelte';
    import { currentBot, state, alert } from '$lib/stores.js';
    import { updateModel } from '$lib/models.js';

    export let data


    const links = [
        { name: "Prompts", url: "prompts" },
        { name: "Sharing", url: "sharing" },
        { name: "Theme", url: "theme" },
        { name: "Chat-GPT", url: "gpt" },
        { name: "Delete", url: "delete" }
    ];

   $: currentPath = $page.url.pathname.split("/").pop();

   const handleSave = async () => {
        $state = 'saving';
        try {
            await updateModel($currentBot.id, $currentBot.name, $currentBot.settings)
        } catch (err) {
            $alert = { type: 'error', msg: err };
            $state = 'error';
            return;
        }
        $state = 'saved';
        $alert = { type: 'success', msg: 'Settings saved' };
    }


</script>


<div class="container grid lg:grid-cols-[12rem_auto_18rem] xl:lg:grid-cols-[12rem_auto_24rem] gap-4 py-4 h-full">
    <div class="h-full relative">
        <div class="sticky top-4">

            <ul class="menu bg-base-200 rounded-box space-y-1" role="navigation">
                <li class="menu-title">Settings</li>
                {#each links as link}
                <li><a href='/account/chatbots/{$page.params.id}/settings/{link.url}' class:active={link.url === currentPath}>{link.name}</a></li>
                {/each}
            </ul>
            <button class="btn btn-outline btn-success my-4 w-full" type="submit" on:click={handleSave}>{$state == 'saving' ? 'Saving' : 'Save'}</button>
        </div>
                

    </div>
    <div>
        <slot />
    </div>

    <div class="h-full min-h-[24rem] relative hidden sm:block">
		<div class="sticky top-4 h-3/4 max-h-[64rem]">
			<Chat modelId={data.model.id} settings={$currentBot.settings} trainingStatus={data.model.status} avatar={$currentBot.settings.avatarImg} />
		</div>
	</div>
</div>

