<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
    import { currentBot, state, alert } from '$lib/stores.js';
	import { updateModel } from '$lib/models';

	export let data: LayoutData;

	currentBot.set(data.model);

	$: currentPath = $page.url.pathname.split("/").pop();

	const currentName = $currentBot.name;

	$: if ($currentBot.name != currentName) {
		$state = 'unsaved'
	} else {
		$state = 'saved'
	} 

	const links = [
        { name: "Chat", url: "" },
        { name: "Share", url: "share" },
        { name: "Integrations", url: "integrations" },
        { name: "Data", url: "data" },
        { name: "History", url: "history" },
        { name: "Settings", url: "settings" },
    ];

	const handleNameSave = () => {
		updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
		$alert = { type: 'success', msg: 'Name saved' };
		$state = 'saved';
	}
</script>

<div class="bg-neutral py-1">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-2 items-center">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots">&larr;</a>
			<h1 class="overflow-x-clip whitespace-nowrap  overflow-ellipsis max-w-3xl py-1 px-2" contenteditable="true" bind:textContent={$currentBot.name}>{$currentBot.name}</h1>
			{#if $state === 'unsaved'}
				<button class="btn btn-xs btn-success btn-outline" on:click={handleNameSave}>save</button>
				<button class="btn btn-xs btn-error btn-outline" on:click={() => $currentBot.name = currentName}>cancel</button>
			{/if}
		</div>

		<div class="tabs tabs-boxed bg-neutral">
			{#each links as link}
				<a href='/account/chatbots/{$page.params.id}/{link.url}' class="tab" class:tab-active={link.url === currentPath}>{link.name}</a>
			{/each}
		</div>
	</div>
</div>

<slot />
