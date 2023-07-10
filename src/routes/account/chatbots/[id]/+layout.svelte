<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
    import { currentBot, state, alert } from '$lib/stores.js';
	import { updateModel } from '$lib/models';

	export let data: LayoutData;

	currentBot.set(data.model);

	$: currentPath = $page.url.pathname.split("/").pop();

	const currentName = $currentBot.name;

	$: if ($currentBot.name !== currentName) {$state = 'unsaved';} 

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
		<div class="flex gap-4 items-center">
			<a class="btn btn-sm text-xs text-white/50 hidden sm:flex" href="/account/chatbots">&larr; Chatbots</a>
			<h1 class="overflow-x-clip whitespace-nowrap  overflow-ellipsis max-w-3xl py-1 px-2" contenteditable="true" bind:textContent={$currentBot.name}>{$currentBot.name}</h1>
			{#if $state === 'unsaved'}
				<button class="btn btn-xs btn-success btn-circle" on:click={handleNameSave}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"/></svg></button>
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
