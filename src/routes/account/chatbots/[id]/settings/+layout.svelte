<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '$lib/components/Chat.svelte';
	import { currentBot, currentBotAvatarImg, state, alert } from '$lib/stores';
	import { updateModel } from '$lib/models.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import { defaultSettings } from '$lib/models.js';
	import themes from '$lib/chatThemes.js';

	export let data;

	$currentBotAvatarImg = $currentBot.avatar_img;

	const links = [
		{ name: 'Prompts', url: 'prompts' },
		{ name: 'Sharing', url: 'sharing' },
		{ name: 'User Info', url: 'user-info' },
		{ name: 'Customize', url: 'customize' },
		{ name: 'ChatGPT', url: 'gpt' },
		{ name: 'Delete', url: 'delete' }
	];

	$state = 'saved';
	let showUserInfoCollection = true;
	let nextURL: string;
	let warningIgnored = false;

	// Merge bot with defaults
	$currentBot.settings = { ...defaultSettings, ...$currentBot.settings };
	$currentBot.settings.theme = {
		...themes[$currentBot.settings.theme.name],
		...$currentBot.settings.theme
	};

	// capture the current state of the bot on load
	let saveState = JSON.stringify($currentBot);

	const checkIfSaved = () => {
		if (saveState === JSON.stringify($currentBot)) {
			$state = 'saved';
		} else {
			$state = 'unsaved';
		}
	};

	const navigateWithoutSaving = () => {
		warningIgnored = true;
		$currentBot = JSON.parse(saveState);
		goto(nextURL);
		warningIgnored = false;
		$state = 'saved';
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
		saveState = JSON.stringify($currentBot);
		$state = 'saved';
		$alert = { type: 'success', msg: 'Settings saved' };
	};

	const handleDiscard = () => {
		warningIgnored = true;
		currentBot.set(JSON.parse(saveState));
		warningIgnored = false;
		$state = 'saved';
	};

	beforeNavigate(({ to, cancel }) => {
		if ($state == 'unsaved' && !warningIgnored) {
			cancel();
			nextURL = to.url.pathname;
			confirmUnsavedNavigate.showModal();
		}
	});

	$: $currentBot, checkIfSaved();
	$: currentPath = $page.url.pathname.split('/').pop();
</script>

<div
	class="container grid lg:grid-cols-[12rem_auto_18rem] xl:lg:grid-cols-[12rem_auto_24rem] gap-4 py-4 h-full flex-1"
>
	<div class="h-full relative">
		<div class="sticky top-4">
			<ul class="menu bg-base-200 rounded-box space-y-1" role="navigation">
				<li class="menu-title">Settings</li>
				{#each links as link}
					<li>
						<a
							href="/account/chatbots/{$page.params.id}/settings/{link.url}"
							class:active={link.url === currentPath}
						>
							{link.name}
						</a>
					</li>
				{/each}
			</ul>
			<div class="flex my-4 gap-2 items-center">
				<button
					class="btn btn-outline btn-warning btn-sm btn-square"
					disabled={$state == 'saved'}
					type="button"
					on:click={() => confirmDiscard.showModal()}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024">
						<path
							fill="currentColor"
							d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z"
						/>
					</svg>
				</button>
				<button
					class="btn btn-outline btn-success flex-1"
					disabled={$state == 'saved'}
					type="submit"
					on:click={handleSave}
				>
					{#if $state == 'saving'}
						<span class="loading loading-spinner loading-xs" />
					{/if}
					{$state == 'saving' ? 'Saving' : 'Save'}
				</button>
			</div>
		</div>
	</div>
	<div>
		<slot />
	</div>

	<div class="h-full min-h-[24rem] relative hidden sm:block">
		<div class="sticky flex flex-col top-4 h-full flex-1 max-h-[40rem] rounded-2xl overflow-hidden">
			<Chat
				modelId={data.model.id}
				settings={$currentBot.settings}
				trainingStatus={data.model.status}
				avatar={$currentBotAvatarImg}
				userId={data.user.session.userId}
				{showUserInfoCollection}
			/>
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-2">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						bind:checked={showUserInfoCollection}
					/>
					<span class="label-text">Show User Info Form Preview</span>
				</label>
			</div>
		</div>
	</div>
</div>

<Modal id="confirmUnsavedNavigate" title="You have unsaved changes">
	<svelte:fragment slot="actions">
		<button class="btn btn-success btn-outline">Stay Here</button>
		<button class="btn btn-error btn-outline" on:click={navigateWithoutSaving}>
			Discard Changes
		</button>
	</svelte:fragment>
</Modal>
<Modal id="confirmDiscard" title="Are you sure you want to discard your edits?">
	<svelte:fragment slot="actions">
		<button class="btn btn-success btn-outline">Cancel</button>
		<button class="btn btn-error btn-outline" on:click={handleDiscard}>Discard Changes</button>
	</svelte:fragment>
</Modal>
