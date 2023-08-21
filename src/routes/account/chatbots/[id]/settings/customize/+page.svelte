<script lang="ts">
	export let data;

	import { defaultSettings } from '$lib/models';
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';
	import { currentBot } from '$lib/stores.js';
	import { enhance } from '$app/forms';
	import { alert } from '$lib/stores';

	let customTheme = {...$currentBot.settings.theme}
	customTheme.name = 'custom'

	let selectedTheme = $currentBot.settings.theme.name || 'default';

	$: if (selectedTheme === 'custom') {
			$currentBot.settings.theme = customTheme;
		} else {
			$currentBot.settings.theme = themes[selectedTheme];
		}

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


</script>

<svelte:head>
	<title>Customize | Settings | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Customize</h2>
		<h3 class="font-bold">Theme</h3>
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
				<label for="default"  class="!bg-[#0F172A] !text-[#818CF8]">ChatNode</label>
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
				<label for="meta-dark" class="!bg-[#3A3B3C] !text-[#171717]">Meta dark</label>
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
				<label for="ios-light" class="!bg-[white] !text-[#3093FF]">iOS light</label>
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
				<label for="ios-dark" class="!bg-[black] !text-[#3093FF]">iOS dark</label>
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
				<label for="neutral" class="!bg-[#666666] !text-[#333333]">Neutral</label>
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
	</div>
	<div class="card-body">
		<div class="flex justify-between items-center">
			<h3 class="font-bold">Header</h3>
			<div class="form-control inline-flex">
				<label class="cursor-pointer label justify-start gap-2">
					<span class="label-text">Enable</span> 
					<input type="checkbox" class="toggle toggle-sm" class:toggle-success={$currentBot.settings.headerEnabled} bind:checked={$currentBot.settings.headerEnabled} />
				</label>
			</div>
		</div>
		
		{#if $currentBot.settings.showHeader}
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
			<div>
						<label for="public-title" class="label">
							<span class="label-text">Header Title</span>
						</label>
						<input
							class="input input-sm w-full"
							type="text"
							name="public-title"
							bind:value={$currentBot.settings.publicTitle}
						/>	
					</div>
				<ColorPicker bind:hex={$currentBot.settings.theme.headerTitle} label="Title Text" />
				<ColorPicker bind:hex={$currentBot.settings.theme.headerBG} label="Background" />
			</div>
			{/if}

			<hr class="border-base-300 my-4">

			<h3 class="font-bold">
				Chat Input
			</h3>
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">


					<div>
						<label for="public-title" class="label">
							<span class="label-text">Placeholder Text</span>
						</label>
						<input
							class="input input-sm w-full"
							type="text"
							name="public-title"
							placeholder="<none>"
							bind:value={$currentBot.settings.inputPlaceholder}
						/>
					</div>
					<ColorPicker bind:hex={$currentBot.settings.theme.inputBG} label=" Background" />
					<ColorPicker bind:hex={$currentBot.settings.theme.inputText} label="Text" />
					<ColorPicker bind:hex={$currentBot.settings.theme.inputBorder} label="Border" />
			</div>

			<hr class="border-base-300 my-4">

			<h3 class="font-bold">
				Chat Bubbles
			</h3>
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">

				
						<ColorPicker
							bind:hex={$currentBot.settings.theme.botBubbleBG}
							label="Bot Bubble Background"
						/>
						<ColorPicker
							bind:hex={$currentBot.settings.theme.botBubbleText}
							label="Bot Bubble Text"
						/>
					
						<ColorPicker
							bind:hex={$currentBot.settings.theme.userBubbleBG}
							label="User Bubble Background"
						/>
						<ColorPicker
							bind:hex={$currentBot.settings.theme.userBubbleText}
							label="User Bubble Text"
						/>
				</div>

				<hr class="border-base-300 my-4">

				<div class="flex justify-between items-center">
					<h2 class="font-bold">Send Button</h2>
					<div class="form-control inline-flex">
						<label class="cursor-pointer label justify-start gap-2">
							<span class="label-text">Enable</span> 
							<input type="checkbox" class="toggle toggle-sm" class:toggle-success={$currentBot.settings.sendButtonEnabled} bind:checked={$currentBot.settings.sendButtonEnabled} />
						</label>
					</div>
				</div>

				{#if $currentBot.settings.sendButtonEnabled}
				<div class="grid grid-cols-4 gap-2 items-end">


					<ColorPicker bind:hex={$currentBot.settings.theme.sendButtonBG} label="Background" />

					<ColorPicker bind:hex={$currentBot.settings.theme.sendButtonIconColor} label="Icon Color" />
				</div>
				{/if}

				<hr class="border-base-300 my-4">

				<h3 class="font-bold">
					Other
				</h3>

				<div class="grid grid-cols-4 gap-2 items-end">


					<ColorPicker bind:hex={$currentBot.settings.theme.bg} label="Chat Background" />

					<ColorPicker bind:hex={$currentBot.settings.theme.resetButton} label="Reset Button" />
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

	:global(.color-picker label) {
		@apply text-xs;
	}
	:global(.color-picker .color, .color-picker .alpha) {
		@apply !w-6 !h-6;
	}
</style>
