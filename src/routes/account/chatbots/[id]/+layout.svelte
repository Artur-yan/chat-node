<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { currentBot, state, alert } from '$lib/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { updateModel } from '$lib/models';

	export let data: LayoutData;

	currentBot.set(data.model);

	$: currentPath = $page.url.pathname.split('/').slice(-2);

	let savedName = $currentBot.name;

	const handleNameSave = async () => {
		$state = 'saving';
		try {
			await updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
		} catch (err) {
			$alert = { type: 'error', msg: err };
			$state = 'error';
			return;
		}
		$state = 'saved';
		savedName = $currentBot.name;
		$alert = { type: 'success', msg: 'Name saved' };
		editBotName.close();
	};

	const handleNameDiscard = () => {
		$currentBot.name = savedName;
		editBotName.close();
	}

</script>

<div class="bg-neutral">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-3 items-center flex-1">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots">
				&larr;
			</a>
			<h1
				class="whitespace-nowrap w-full overflow-clip group"
			>
			{$currentBot.name}
				<button class="btn btn-xs md:hidden md:group-hover:inline-block ml-2" on:click={() => editBotName.showModal()}>edit</button>
			</h1>
		</div>
		<div class="tabs tabs-boxed bg-neutral">
			<a
				href="/account/chatbots/{$page.params.id}/"
				class="tab"
				class:tab-active={currentPath[1] === $page.params.id}
			>
				Chat
			</a>
			<a
				href="/account/chatbots/{$page.params.id}/share"
				class="tab"
				class:tab-active={currentPath[1] === 'share'}
			>
				Share/Integrate
			</a>
			<!-- <a
				href="/account/chatbots/{$page.params.id}/integrations"
				class="tab"
				class:tab-active={currentPath[1] === 'integrations'}
			>
				Integrations
			</a> -->
			<a
				href="/account/chatbots/{$page.params.id}/data"
				class="tab"
				class:tab-active={currentPath[1] === 'data'}
			>
				Data
			</a>
			<a
				href="/account/chatbots/{$page.params.id}/history"
				class="tab"
				class:tab-active={currentPath[1] === 'history'}
			>
				History
			</a>
			<a
				href="/account/chatbots/{$page.params.id}/settings"
				class="tab"
				class:tab-active={currentPath[0] === 'settings'}
			>
				Settings
			</a>
		</div>
	</div>
</div>

<slot />

<Modal id="editBotName" title="Edit Name" closeOnOutsideClick={false} >
	<form on:submit|preventDefault={handleNameSave}>
		<input
			class="input input-bordered w-full"
			type="text"
			name="name"
			placeholder="Bot Name"
			bind:value={$currentBot.name}
			autofocus
		/>

	</form>
	<svelte:fragment slot="actions">
		<button on:click={handleNameDiscard} class="btn btn-outline join-item btn-error">Discard</button>
		<button type="button" class="btn btn-success btn-outline join-item" on:click={handleNameSave}>Save</button>
	</svelte:fragment>
</Modal>
