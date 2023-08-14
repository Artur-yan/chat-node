<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '$lib/components/Chat.svelte';
	import { currentBot, state, alert } from '$lib/stores';
	import { updateModel } from '$lib/models.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';



	export let data;

	$: console.log(data)


	const links = [
		{ name: 'Prompts', url: 'prompts' },
		{ name: 'Sharing', url: 'sharing' },
		{ name: 'Theme', url: 'theme' },
		{ name: 'Chat-GPT', url: 'gpt' },
		{ name: 'Delete', url: 'delete' }
	];

	let saved = true

	$: currentPath = $page.url.pathname.split('/').pop();

	const saveState = JSON.stringify($currentBot)


	const checkIfSaved = () => {
		if(saveState === JSON.stringify($currentBot)) {
			saved = true
		} else {
			saved = false
		}
	}

	$: $currentBot, checkIfSaved()

	let nextURL: string;
	let warningIgnored = false;

	beforeNavigate(({to, cancel}) => {
		if (!saved && !warningIgnored) {
			cancel()
			nextURL = to.url.pathname
			confirmUnsavedNavigate.showModal()
		}
	})

	const navigateWithoutSaving = () => {
		warningIgnored = true;
		currentBot.set(JSON.parse(saveState));
		goto(nextURL);
		warningIgnored = false;
		saved = true

	};

	const handleSave = async () => {
		$state = 'saving';
		try {
			await updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
		} catch (err) {
			$alert = { type: 'error', msg: err };
			$state = 'error';
			return;
		}
		$state = 'saved';
		$alert = { type: 'success', msg: 'Settings saved' };
	};
</script>

<div
	class="container grid lg:grid-cols-[12rem_auto_18rem] xl:lg:grid-cols-[12rem_auto_24rem] gap-4 py-4 h-full"
>
	<div class="h-full relative">
		<div class="sticky top-4">
			<ul class="menu bg-base-200 rounded-box space-y-1" role="navigation">
				<li class="menu-title">Settings</li>
				{#each links as link}
					<li>
						<a
							href="/account/chatbots/{$page.params.id}/settings/{link.url}"
							class:active={link.url === currentPath}>{link.name}</a
						>
					</li>
				{/each}
			</ul>
			<button class="btn btn-outline btn-success my-4 w-full" type="submit" on:click={handleSave}
				>
				{#if $state == 'saving'}
				<span class="loading loading-spinner loading-xs"></span>
				{/if}
				
				{$state == 'saving' ? 'Saving' : 'Save'}</button
			>
		</div>
	</div>
	<div>
		<slot />
	</div>

	<div class="h-full min-h-[24rem] relative hidden sm:block">
		<div class="sticky top-4 h-3/4 max-h-[64rem]">
			<Chat
				modelId={data.model.id}
				settings={$currentBot.settings}
				trainingStatus={data.model.status}
				avatar={$currentBot.avatar_img}
			/>
		</div>
	</div>
</div>

<Modal id="confirmUnsavedNavigate" title="You have unsaved changes">
	
	<svelte:fragment slot="actions">
		<button class="btn btn-success btn-outline">Stay Here</button>
		<button class="btn btn-error btn-outline" on:click={navigateWithoutSaving}>Discard Changes</button>
	</svelte:fragment>
</Modal>


<!-- <dialog id="confirmUnsavedNavigate" class="modal">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg mb-8">You have unsaved changes</h3>
		<button class="btn btn-success btn-outline">Stay Here</button>
		<button class="btn btn-error btn-outline" on:click={navigateWithoutSaving}>Don't Save</button>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog> -->
