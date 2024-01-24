<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';
	import { currentBot, currentBotAvatarImg, currentBotPopupImg } from '$lib/stores.js';
	import { enhance } from '$app/forms';
	import { alert } from '$lib/stores';

	export let data;
	export let form;
	export let popupImgForm: any;
	let savingAvatar: boolean = false;
	let savingPopupImg: boolean = false;
	let lastToggled: string = '';

	let uploadedImage: string | null;
	let uploadedPopupImage: string | null;

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

	$: if (popupImgForm) {
		$alert = {
			type: 'success',
			msg: 'Popup Updated'
		};
		uploadedPopupImage = null;
	}

	const handlePopupImgSelect = async (e: Event) => {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		// URL.createObjectURL() creates a temporary URL for the image we can use as src for an img tag
		uploadedPopupImage = URL.createObjectURL(image);
		$currentBotPopupImg = URL.createObjectURL(image);
	};

	$: if(lastToggled === 'openChatByDefault') {
		console.log('last toggled is openChatByDefault')
		$currentBot.settings.popupButtonMessageEnabled = false;
		$currentBot.settings.openChatByDefault = true;
	} else if (lastToggled === 'popupButtonMessageEnabled') {
		console.log('last toggled is popupButtonMessageEnabled')
		$currentBot.settings.openChatByDefault = false;
		$currentBot.settings.popupButtonMessageEnabled = true;
	}
</script>

<svelte:head>
	<title>Customize | Settings | {data.model.name} | ChatNode</title>
</svelte:head>

<!-- Theme Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Theme</h2>
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
	</div>
</div>

<!-- Header Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<h2 class="card-title">Header</h2>
			<div class="form-control">
				<label class="cursor-pointer label gap-2">
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
			<ColorPicker
			bind:hex={$currentBot.settings.theme.headerShadow}
			label="Header Shadow"
			on:input={checkIfThemeSaved}
			/>
		</div>
	{/if}
	</div>
</div>

<!-- Status Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<h2 class="card-title">Status</h2>
			<div class="form-control">
				<label class="cursor-pointer label gap-2">
					<span class="label-text">Enable</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.statusEnabled}
						bind:checked={$currentBot.settings.statusEnabled}
					/>
				</label>
			</div>
		</div>
		{#if $currentBot.settings.statusEnabled}
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
				<div>
					<label for="public-title" class="label">
						<span class="label-text">Status Title</span>
					</label>
					<input
						class="input input-sm w-full"
						type="text"
						name="public-title"
						bind:value={$currentBot.settings.theme.statusMessage}
					/>
				</div>
				<ColorPicker
					bind:hex={$currentBot.settings.theme.statusColor}
					label="Status Color"
					on:input={checkIfThemeSaved}
				/>
			</div>
		{/if}
	</div>
</div>


<!-- Chat Bubbles Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Chat Bubbles</h2>
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
	</div>
	
</div>

<!-- Chat Input Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Chat Input</h2>
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
	</div>
</div>


<!-- Send Button Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-2">
			<h2 class="card-title">Send Button</h2>
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
		<div class="grid grid-cols-4 gap-2 items-end mt-4">
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
	</div>
</div>

<!-- Suggested Questions Section -->
<!-- <div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Suggested Questions Button</h2>
		<div class="flex gap-2 items-center mt-2">
			<ColorPicker
				bind:hex={$currentBot.settings.theme.suggestedQuestionsBG}
				label="Button Color"
				on:input={checkIfThemeSaved}
			/>

			<ColorPicker
				bind:hex={$currentBot.settings.theme.suggestedQuestionsShadow}
				label="Button Shadow"
				on:input={checkIfThemeSaved}
			/>
		</div>
	</div>
</div> -->


<!-- Avatar Section -->
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
					<img src={$currentBotAvatarImg} class="w-16 mx-auto mb-2" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover;" alt="Avatar" />
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
						accept=".jpg, .png, .svg, .jpeg, .gif"
						class="join-item file-input file-input-bordered w-full"
						on:change={handleAvatarSelect}
					/>
					<input
						name="existing-cloudinary-public-id"
						type="hidden"
						value={$currentBot.cloudinary_public_id}
					/>
					<input
						on:click={() => (savingAvatar = true)}
						type="submit"
						class="btn join-item border-primary"
						value="{savingAvatar ? 'Saving' : 'Confirm'}"
						formaction="?/updateAvatarImg"
						disabled={!uploadedImage}
					/>
				</form>
				<p class="help italic text-sm text-gray-500">1MB Max. png, svg, jpg, jpeg, or gif</p>
			</div>
		</div>
	</div>
</div>

<!-- Popup Button Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-2">
			<h2 class="card-title">Popup Button</h2>
			<div>
				<div class="flex justify-between">
					<div class="flex items-end">
						<div class="form-control">
							<div class="flex gap-3 mx-2">
								<label class="label cursor-pointer justify-start gap-3">
									<input
										type="checkbox"
										class="toggle toggle-sm"
										bind:checked={$currentBot.settings.openChatByDefault}
										on:click={() => lastToggled = 'openChatByDefault'}
									/>
									<span class="label-text">Open chat window by default</span>
								</label>

								<label class="label cursor-pointer justify-start gap-3">
									<input
										type="checkbox"
										class="toggle toggle-sm bg-white"
										bind:checked={$currentBot.settings.popupButtonRight}
									/>
									<span class="label-text">Button Placement: {$currentBot.settings.popupButtonRight ? 'Right' : 'Left'}</span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		{#if data.subscription.plan === 0}
			<div class="alert alert-neutral text-warning justify-between flex">
				<p>Available on the Basic plan</p>
				<a href="/account/settings/subscription" class="btn btn-info btn-sm">Upgrade</a>
			</div>
		{/if}
		<div class="flex gap-8">
			{#if $currentBot.cloudinary_public_id_popup}
				<div class="text-center">
					<img src={$currentBotPopupImg} class="w-16 mx-auto mb-2" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover;" alt="Chat Button" />
					<form method="post" enctype="multipart/form-data">
						<input
							name="existing-cloudinary-public-id-popup"
							type="hidden"
							value={$currentBot.cloudinary_public_id_popup}
						/>
						<input
							type="submit"
							class="btn btn-xs btn-error btn-outline"
							value="Remove"
							formaction="?/removePopupImg"
						/>
					</form>
				</div>

				{:else}
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

			{/if}
			<div class="flex-1">
				<form method="post" enctype="multipart/form-data" class="join w-full">
					<input
						disabled={data.subscription.plan === 0}
						name="chat-button-img"
						type="file"
						accept=".jpg, .png, .svg, .jpeg, .gif"
						class="join-item file-input file-input-bordered w-full"
						on:change={handlePopupImgSelect}
					/>
					<input
						name="existing-cloudinary-public-id-popup"
						type="hidden"
						value={$currentBot.cloudinary_public_id_popup}
					/>
					<input
						on:click={() => (savingPopupImg = true)}
						type="submit"
						class="btn join-item border-primary"
						value="{savingPopupImg ? 'Saving' : 'Confirm'}"
						formaction="?/updatePopupImg"
						disabled={!uploadedPopupImage}
					/>
				</form>
				<p class="help italic text-sm text-gray-500">1MB Max. png, svg, jpg, jpeg, or gif</p>
				
			</div>
		</div>
		{#if !$currentBot.cloudinary_public_id_popup}
			<div class="my-2 font-bold">Button Color</div>
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
		{/if}
	</div>
</div>

<!-- Popup Message Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex items-center gap-3">
			<h2 class="card-title">Popup Message</h2>
			<div class="flex start items-center">
				<div class="form-control">
					<label class="cursor-pointer label justify-start gap-2">
						<span class="label-text">Enable</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							class:toggle-success={$currentBot.settings.popupButtonMessageEnabled}
							bind:checked={$currentBot.settings.popupButtonMessageEnabled}
							on:click={() => lastToggled = 'popupButtonMessageEnabled'}
						/>
					</label>
				</div>
			</div>
		</div>

		{#if $currentBot.settings.popupButtonMessageEnabled}
		<input 
			bind:value={$currentBot.settings.popupButtonMessageText}
			type="text" 
			placeholder="Your Message Here" 
			class="input input-bordered w-full max-w-xs"
	   />
		
		<!-- Bottom Row -->
		<div class="flex gap-8 mt-4 ml-4">
			<div class="grid grid-cols-1">
				<h3 class="font-bold">Message placement</h3>
					<div class="form-control md:pt-2">
						<label class="label cursor-pointer flex justify-start gap-9">
							<span class="label-text">Top</span> 
							<input 
								on:click={() => $currentBot.settings.popupButtonMessagePlacement = 'top'}
								checked={$currentBot.settings.popupButtonMessagePlacement === 'top'}
								type="radio" 
								name="radio-10" 
								class="radio checked:bg-indigo-400" 
							/>
						</label>
					</div>
					<div class="form-control">
						<label class="label cursor-pointer flex justify-start gap-8">
							<span class="label-text">Side</span> 
							<input
								on:click={() => $currentBot.settings.popupButtonMessagePlacement = 'side'}
								checked={$currentBot.settings.popupButtonMessagePlacement === 'side'} 
								type="radio" 
								name="radio-10" 
								class="radio checked:bg-indigo-400"
							 />
						</label>
					</div>
			</div>

			<!-- Colors -->
			<div>
				<h3 class="font-bold">Colors</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
					<ColorPicker
						bind:hex={$currentBot.settings.theme.popupButtonMessageBG}
						label="Background"
					/>
					<ColorPicker
						bind:hex={$currentBot.settings.theme.popupButtonMessageTextColor}
						label="Text Color"
					/>
					<ColorPicker
					bind:hex={$currentBot.settings.theme.popupButtonMessageGlowColor}
					label="Glow Color"
					/>
					</div>
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
		@apply ring-2 ring-white/80;
	}

	:global(.color-picker label) {
		@apply text-xs;
	}
	:global(.color-picker label .color, .color-picker label .alpha) {
		@apply !w-6 !h-6;
	}
</style>
