<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
    import { currentBot, state, alert } from '$lib/stores.js';
	import { updateModel } from '$lib/models';
	import { beforeNavigate, goto } from '$app/navigation';

	export let data: LayoutData;

	currentBot.set(data.model);

	const currentBotSaveState = $currentBot;
	$: currentPath = $page.url.pathname.split("/").pop();

	const currentName = $currentBot.name;

	//Check for change, ignore first run whuch happens on load
	let checkCount = 0;
	const checkForChange= () =>{
		checkCount++;
		if (checkCount > 1) {
			$state = 'unsaved'
		}
	}

	$: $currentBot, checkForChange()

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

	let nextURL;
	let warningIgnored = false;

	// beforeNavigate(({to, cancel}) => {
	// 	if ($state === 'unsaved' && !warningIgnored) {
	// 		cancel()
	// 		nextURL = to?.url.pathname
	// 		confirmUnsavedNavigate.showModal()
	// 	}
	// })
	
	const navigateWithoutSaving = () => {
		warningIgnored = true;
		$currentBot = currentBotSaveState;
		goto(nextURL)
	}
</script>

<div class="bg-neutral py-1">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-2 items-center">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots">&larr;</a>
			<h1 class="overflow-x-clip whitespace-nowrap  overflow-ellipsis max-w-3xl py-1 px-2" contenteditable="true" bind:textContent={$currentBot.name}>{$currentBot.name}</h1>
			{#if $state === 'unsavedName'}
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


<dialog id="confirmUnsavedNavigate" class="modal">
  <form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg mb-8">You have unsaved changes</h3>
    <button class="btn btn-success btn-outline">Stay Here</button>
	<button class="btn btn-error btn-outline" on:click={navigateWithoutSaving}>Don't Save</button>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>