<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { currentBot, state, alert } from '$lib/stores';
	import { updateModel } from '$lib/models';
	import { beforeNavigate, goto } from '$app/navigation';

	export let data: LayoutData;

	currentBot.set(data.model);

	const currentBotSaveState = $currentBot;

	$: currentPath = $page.url.pathname.split('/').pop();

	const savedName = $currentBot.name;
	// $: savedName != $currentBot.name ? $state = 'unsavedName' : $state = 'saved';

	$: $currentBot.name !== savedName ? $state = 'unsaved' : $state = 'saved';

	//Check for change, ignore first run whuch happens on load
	// let checkCount = 0;
	// const checkForChange = () => {
	// 	checkCount++;
	// 	if (checkCount > 1) {
	// 		$state = 'unsaved';
	// 	}
	// };

	// $: $currentBot, checkForChange();

	const links = [
		{ name: 'Chat', url: '' },
		{ name: 'Share', url: 'share' },
		{ name: 'Integrations', url: 'integrations' },
		{ name: 'Data', url: 'data' },
		{ name: 'History', url: 'history' },
		{ name: 'Settings', url: 'settings' }
	];

	const handleNameSave = () => {
		updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
		$alert = { type: 'success', msg: 'Name saved' };
		$state = 'saved';
	};

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
		goto(nextURL);
	};
</script>

<div class="bg-neutral">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-2 items-center">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots"
				>&larr;</a
			>
			<input
				class="input bg-black/10 border-none rounded-none input-ghost whitespace-nowrap p-1 px-4"
				bind:value={$currentBot.name} />
			{#if $state == 'unsaved'}
				<button class="btn btn-xs btn-success btn-square btn-outline" on:click={handleNameSave}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.586 13.414l-2.829-2.828L6.343 12l4.243 4.243l7.07-7.071l-1.413-1.415l-5.657 5.657Z"/></svg></button>
				<button
					class="btn btn-xs btn-error btn-square btn-outline"
					on:click={() => ($currentBot.name = savedName)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m16.192 6.344l-4.243 4.242l-4.242-4.242l-1.414 1.414L10.535 12l-4.242 4.242l1.414 1.414l4.242-4.242l4.243 4.242l1.414-1.414L13.364 12l4.242-4.242z"/></svg></button
				>
			{/if}
		</div>

		<div class="tabs tabs-boxed bg-neutral">
			{#each links as link}
				<a
					href="/account/chatbots/{$page.params.id}/{link.url}"
					class="tab"
					class:tab-active={link.url === currentPath}>{link.name}</a
				>
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
