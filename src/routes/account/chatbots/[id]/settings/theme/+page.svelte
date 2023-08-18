<script lang="ts">
	export let data;

	import { defaultSettings } from '$lib/models';
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';
	import { currentBot } from '$lib/stores.js';
	import { enhance } from '$app/forms';
	import { alert } from '$lib/stores';

	let settings = defaultSettings;
	let customTheme;
	let selectedTheme = settings.theme.name || 'default';

	let uploadedImage: string | null;

	export let form;

	$: {
		if (form) {
			$alert = {
				type: 'success',
				msg: 'Avatar Updated'
			};
			uploadedImage = null;
		}
	}
	const handleAvatarSelect = async (e: Event) => {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		// URL.createObjectURL() creates a temporary URL for the image we can use as src for an img tag
		uploadedImage = URL.createObjectURL(image);
		$currentBot.avatar_img = URL.createObjectURL(image);
	};

	if ((selectedTheme = 'custom')) {
		customTheme = settings.theme;
	}

	$: if (selectedTheme !== 'custom') {
		$currentBot.settings.theme = themes[selectedTheme];
	} else {
		settings.theme = customTheme;
	}

	$currentBot.settings.publicTitle = $currentBot.settings.publicTitle || data.model.name
</script>

<svelte:head>
	<title>Theme | Settings | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title justify-between items-baseline">
			Header
			<div class="form-control inline-flex">
				<label class="cursor-pointer label justify-start gap-2">
					<span class="label-text">Enable</span> 
					<input type="checkbox" class="toggle" bind:checked={$currentBot.settings.showHeader} />
				</label>
			</div>
		</h2>
		<div>

			{#if $currentBot.settings.showHeader}
			<label for="public-title" class="label">
				<span class="label-text">Header Title</span>
			</label>
			<input class="input" type="text" name="public-title" bind:value={$currentBot.settings.publicTitle} />
			{/if}
		</div>
	</div>
</div>


<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Avatar</h2>
		{#if data.subscription.plan < 2}
			<div class="alert alert-neutral text-warning justify-between flex">
				<p>Available on the Pro plan</p>
				<a href="/account/settings/subscription" class="btn btn-info btn-sm">Upgrade</a>
			</div>
		{/if}
		<div class="flex gap-2">
			<form method="post" enctype="multipart/form-data" class="join w-full" use:enhance>
				<input
					disabled={data.subscription.plan < 2}
					name="avatar-img"
					type="file"
					accept=".jpg, .png, .svg"
					class="join-item file-input file-input-bordered w-full"
					on:change={handleAvatarSelect}
				/>
				<input
					name="existing-cloudinary-public-id"
					type="hidden"
					value={$currentBot.cloudinary_public_id}
				/>
				<input
					type="submit"
					class="btn join-item border-primary border-l-0"
					value="Save"
					formaction="?/updateAvatarImg"
					disabled={!uploadedImage}
				/>
			</form>
		</div>
		<p>1MB Max. png, svg, or jpg</p>
	</div>
</div>
<div class="card bg-neutral card-compact">
	<div class="card-body">
		<h2 class="card-title">Colors</h2>
		<div class="themes">
			<div>
				<input
					class="hidden"
					type="radio"
					id="default"
					name="theme"
					value="default"
					bind:group={selectedTheme}
				/>
				<label for="default">ChatNode</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="meta-dark"
					name="theme"
					value="meta-dark"
					bind:group={selectedTheme}
				/>
				<label for="meta-dark">Meta dark</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="ios-light"
					name="theme"
					value="ios-light"
					bind:group={selectedTheme}
				/>
				<label for="ios-light">iOS light</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="ios-dark"
					name="theme"
					value="ios-dark"
					bind:group={selectedTheme}
				/>
				<label for="ios-dark">iOS dark</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="neutral"
					name="theme"
					value="neutral"
					bind:group={selectedTheme}
				/>
				<label for="neutral">Neutral</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="custom"
					name="theme"
					value="custom"
					bind:group={selectedTheme}
				/>
				<label for="custom">Custom</label>
			</div>
		</div>
		{#if selectedTheme == 'custom'}
			<div class="space-y-6 mt-4">
				<div>
					<ColorPicker bind:hex={$currentBot.settings.theme.bg} label="Background" />
				</div>
				<div class="grid grid-cols-3">
					<ColorPicker
						bind:hex={$currentBot.settings.theme.botBubbleBG}
						label="Bot Bubble Background"
					/>
					<ColorPicker
						bind:hex={$currentBot.settings.theme.botBubbleText}
						label="Bot Bubble Text"
					/>
				</div>
				<div class="grid grid-cols-3">
					<ColorPicker
						bind:hex={$currentBot.settings.theme.userBubbleBG}
						label="User Bubble Background"
					/>
					<ColorPicker
						bind:hex={$currentBot.settings.theme.userBubbleText}
						label="User Bubble Text"
					/>
				</div>

				<div class="grid grid-cols-3">
					<ColorPicker bind:hex={$currentBot.settings.theme.inputBG} label="Input Background" />
					<ColorPicker bind:hex={$currentBot.settings.theme.inputText} label="Input Text" />
					<ColorPicker bind:hex={$currentBot.settings.theme.inputBorder} label="Input Border" />
				</div>

				<div class="grid grid-cols-3">
					<ColorPicker
						bind:hex={$currentBot.settings.theme.sendButtonBG}
						label="Send Button Background"
					/>
					<ColorPicker
						bind:hex={$currentBot.settings.theme.sendButtonIconColor}
						label="Send Button Icon"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.themes {
		@apply flex items-center gap-2 flex-wrap;
	}

	.themes label {
		@apply btn btn-sm;
	}

	.themes input:checked + label {
		@apply btn-primary;
	}
</style>
