<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';
	import { currentBot, currentBotAvatarImg } from '$lib/stores.js';
	import { enhance } from '$app/forms';
	import { alert } from '$lib/stores';

	export let data;
	export let form;

	let uploadedImage: string | null;

	let themeSaveState = JSON.stringify($currentBot.settings.theme);

	const checkIfThemeSaved = () => {
		if (themeSaveState !== JSON.stringify($currentBot.settings.theme)) {
			$currentBot.settings.theme.name = 'custom';
		}
	};

	const changeTheme = (themeName) => {
		$currentBot.settings.theme = { ...themes[themeName] };
	};

	$: if (form) {
		$alert = {
			type: 'success',
			msg: 'Avatar Updated'
		};
		uploadedImage = null;
	}

	const handleAvatarSelect = async (e: Event) => {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		// URL.createObjectURL() creates a temporary URL for the image we can use as src for an img tag
		uploadedImage = URL.createObjectURL(image);
		$currentBotAvatarImg = URL.createObjectURL(image);
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
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('default')}
				/>
				<label for="default" class="!bg-[#0F172A] !text-[#818CF8]">ChatNode</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="meta-dark"
					name="theme"
					value="meta-dark"
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('meta-dark')}
				/>
				<label for="meta-dark" class="!bg-[#3A3B3C] !text-[#0084FF]">Meta dark</label>
			</div>
			<div>
				<input
					class="hidden"
					type="radio"
					id="ios-light"
					name="theme"
					value="ios-light"
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('ios-light')}
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
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('ios-dark')}
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
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('neutral')}
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
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('custom')}
				/>
				<label for="custom">Custom</label>
			</div>
		</div>
	</div>
	<div class="card-body">
		<h3 class="font-bold">Misc.</h3>

		<div class="grid grid-cols-4 gap-2 items-end">
			<ColorPicker
				bind:hex={$currentBot.settings.theme.bg}
				label="Chat Background"
				on:input={checkIfThemeSaved}
			/>

			<ColorPicker
				bind:hex={$currentBot.settings.theme.resetButton}
				label="Reset Button"
				on:input={checkIfThemeSaved}
			/>
		</div>

		<hr class="border-base-300 my-4" />

		<div class="flex justify-between items-center">
			<h3 class="font-bold">Header</h3>
			<div class="form-control inline-flex">
				<label class="cursor-pointer label justify-start gap-2">
					<span class="label-text">Enable</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.headerEnabled}
						bind:checked={$currentBot.settings.headerEnabled}
					/>
				</label>
			</div>
		</div>

		{#if $currentBot.settings.headerEnabled}
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
				<ColorPicker
					bind:hex={$currentBot.settings.theme.headerTitle}
					label="Title Text"
					on:input={checkIfThemeSaved}
				/>
				<ColorPicker
					bind:hex={$currentBot.settings.theme.headerBG}
					label="Background"
					on:input={checkIfThemeSaved}
				/>
			</div>
		{/if}

		<hr class="border-base-300 my-4" />

		<h3 class="font-bold">Chat Bubbles</h3>
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
			<ColorPicker
				bind:hex={$currentBot.settings.theme.botBubbleBG}
				label="Bot Bubble Background"
				on:input={checkIfThemeSaved}
			/>
			<ColorPicker
				bind:hex={$currentBot.settings.theme.botBubbleText}
				label="Bot Bubble Text"
				on:input={checkIfThemeSaved}
			/>

			<ColorPicker
				bind:hex={$currentBot.settings.theme.userBubbleBG}
				label="User Bubble Background"
				on:input={checkIfThemeSaved}
			/>
			<ColorPicker
				bind:hex={$currentBot.settings.theme.userBubbleText}
				label="User Bubble Text"
				on:input={checkIfThemeSaved}
			/>
		</div>

		<hr class="border-base-300 my-4" />

		<h3 class="font-bold">Chat Input</h3>
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
			<ColorPicker
				bind:hex={$currentBot.settings.theme.inputBG}
				label=" Background"
				on:input={checkIfThemeSaved}
			/>
			<ColorPicker
				bind:hex={$currentBot.settings.theme.inputText}
				label="Text"
				on:input={checkIfThemeSaved}
			/>
			<ColorPicker
				bind:hex={$currentBot.settings.theme.inputBorder}
				label="Border"
				on:input={checkIfThemeSaved}
			/>
		</div>

		<hr class="border-base-300 my-4" />

		<div class="flex justify-between items-center">
			<h2 class="font-bold">Send Button</h2>
			<div class="form-control inline-flex">
				<label class="cursor-pointer label justify-start gap-2">
					<span class="label-text">Enable</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.sendButtonEnabled}
						bind:checked={$currentBot.settings.sendButtonEnabled}
					/>
				</label>
			</div>
		</div>

		{#if $currentBot.settings.sendButtonEnabled}
			<div class="grid grid-cols-4 gap-2 items-end">
				<ColorPicker
					bind:hex={$currentBot.settings.theme.sendButtonBG}
					label="Background"
					on:input={checkIfThemeSaved}
				/>

				<ColorPicker
					bind:hex={$currentBot.settings.theme.sendButtonIconColor}
					label="Icon Color"
					on:input={checkIfThemeSaved}
				/>
			</div>
		{/if}

		<hr class="border-base-300 my-4" />

		<div>
			<div>
				<h3 class="font-bold mb-2">Popup Chat</h3>
			</div>
			<div class="flex justify-between">
				<div class="flex items-end">
					<div>
						<div class="mb-2">Button Color</div>
						<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
							<ColorPicker
								bind:hex={$currentBot.settings.theme.popupButtonBG}
								label="Background"
								on:input={checkIfThemeSaved}
							/>
							<ColorPicker
								bind:hex={$currentBot.settings.theme.popupButtonIcon}
								label="Icon"
								on:input={checkIfThemeSaved}
							/>
						</div>
					</div>
					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="toggle"
								bind:checked={$currentBot.settings.openChatByDefault}
							/>
							<span class="label-text">Open chat window by default</span>
						</label>
					</div>
				</div>
				<div>
					<svg
						clip-rule="evenodd"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-miterlimit="10"
						version="1.1"
						width="56"
						height="56"
						viewBox="0 0 64 64"
						xml:space="preserve"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g>
							<path
								d="m0 32c0-17.673 14.327-32 32-32s32 14.327 32 32-14.327 32-32 32-32-14.327-32-32z"
								fill={$currentBot.settings.theme.popupButtonBG}
							/>
							<path
								d="m26 16c-5.5228 0-10 4.4772-10 10v12c0 5.5228 4.4772 10 10 10h19.5c1.3807 0 2.5-1.1193 2.5-2.5v-19.5c0-5.5228-4.4772-10-10-10h-12zm-0.75 16c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm8.75 0c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm6.75 2c1.1046 0 2-0.8954 2-2s-0.8954-2-2-2-2 0.8954-2 2 0.8954 2 2 2z"
								fill={$currentBot.settings.theme.popupButtonIcon}
								fill-rule="evenodd"
							/>
						</g>
					</svg>
				</div>
			</div>
			<div class="text-white mt-8 flex items-end gap-1">
				<div class="text-warning">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024">
						<path
							fill="currentColor"
							d="M928.99 755.83L574.6 203.25c-12.89-20.16-36.76-32.58-62.6-32.58s-49.71 12.43-62.6 32.58L95.01 755.83c-12.91 20.12-12.9 44.91.01 65.03c12.92 20.12 36.78 32.51 62.59 32.49h708.78c25.82.01 49.68-12.37 62.59-32.49c12.91-20.12 12.92-44.91.01-65.03zM554.67 768h-85.33v-85.33h85.33V768zm0-426.67v298.66h-85.33V341.32l85.33.01z"
						/>
					</svg>
				</div>
				You will need to copy/paste the new embed script on your site whenever you make changes here.
			</div>
		</div>
	</div>
</div>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Avatar</h2>
		{#if data.subscription.plan === 0}
			<div class="alert alert-neutral text-warning justify-between flex">
				<p>Available on the Basic plan</p>
				<a href="/account/settings/subscription" class="btn btn-info btn-sm">Upgrade</a>
			</div>
		{/if}
		<div class="flex gap-8">
			{#if $currentBot.cloudinary_public_id}
				<div class="text-center">
					<img src={$currentBotAvatarImg} class="w-16 mx-auto mb-2" alt="Avatar" />
					<form method="post" enctype="multipart/form-data">
						<input
							name="existing-cloudinary-public-id"
							type="hidden"
							value={$currentBot.cloudinary_public_id}
						/>
						<input
							type="submit"
							class="btn btn-xs btn-error btn-outline"
							value="Remove"
							formaction="?/removeAvatarImg"
						/>
					</form>
				</div>
			{/if}
			<div class="flex-1">
				<form method="post" enctype="multipart/form-data" class="join w-full">
					<input
						disabled={data.subscription.plan === 0}
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
						class="btn join-item border-primary"
						value="Confirm"
						formaction="?/updateAvatarImg"
						disabled={!uploadedImage}
					/>
				</form>
				<p class="help">1MB Max. png, svg, or jpg</p>
			</div>
		</div>
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
		@apply ring-2 ring-white/80;
	}

	:global(.color-picker label) {
		@apply text-xs;
	}
	:global(.color-picker label .color, .color-picker label .alpha) {
		@apply !w-6 !h-6;
	}
</style>
