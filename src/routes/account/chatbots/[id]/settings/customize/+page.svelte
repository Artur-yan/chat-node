<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';
	import { currentBot, currentBotAvatarImg, currentBotPopupImg } from '$lib/stores.js';
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

	// Forcing Feedback by default
	if ($currentBot.settings.feedbackEnabled === undefined) {
		$currentBot.settings.feedbackEnabled = true;
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
			<!-- <div>
				<input
					class="hidden"
					type="radio"
					id="dracula"
					name="theme"
					value="dracula"
					bind:group={$currentBot.settings.theme.name}
					on:input={() => changeTheme('dracula')}
				/>
				<label for="dracula" class="!bg-[#282a36] !text-[#bd93f9]">Dracula</label>
			</div> -->
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
				<div class="mb-1">
					<ColorPicker
						bind:hex={$currentBot.settings.theme.headerTitle}
						label="Title Text"
						on:input={checkIfThemeSaved}
					/>
				</div>
			</div>
			<div class="flex gap-6 my-8">
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

			<ColorPicker
				bind:hex={$currentBot.settings.theme.resetButton}
				label="Reset Button"
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

<!-- Background Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<h2 class="card-title">Background</h2>
		</div>
		<div class="grid grid-cols-4 gap-2 items-end">
			<ColorPicker
				bind:hex={$currentBot.settings.theme.bg}
				label="Chat Background"
				on:input={checkIfThemeSaved}
			/>
		</div>
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

<!-- Sound Effects Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<h2 class="card-title">Sound Effects</h2>
			<div class="form-control">
				<label class="cursor-pointer label gap-2">
					<span class="label-text">Enable</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.soundEffects}
						bind:checked={$currentBot.settings.soundEffects}
					/>
				</label>
			</div>
		</div>
	</div>
</div>

<!-- Feedback Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-2">
			<h2 class="card-title">Feedback</h2>
			<div class="form-control inline-flex">
				<label class="cursor-pointer label justify-start gap-2">
					<span class="label-text">Enable</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.feedbackEnabled}
						bind:checked={$currentBot.settings.feedbackEnabled}
					/>
				</label>
			</div>
		</div>
		{#if $currentBot.settings.feedbackEnabled}
			<div class="grid grid-cols-4 gap-2 items-end mt-4">
				<!-- <ColorPicker
				bind:hex={$currentBot.settings.theme.feedbackBGColor}
				label="Background Color"
				on:input={checkIfThemeSaved}
				/> -->

				<ColorPicker
					bind:hex={$currentBot.settings.theme.feedbackIconColor}
					label="Icon Color"
					on:input={checkIfThemeSaved}
				/>
			</div>
		{/if}
	</div>
</div>


<!-- Powered By ChatNode -->
{#if data.subscription.plan !== 0 && data.subscription.plan !== 1001 && data.subscription.plan !== 5 && data.subscription.plan !== 105 && data.subscription.plan !== 6 && data.subscription.plan !== 106 && data.subscription?.addons?.['10005']?.['status'] !== 'active'}
	<div class="card bg-neutral card-compact mb-4">
		<div class="card-body">
			<div class="flex gap-4 items-center">
				<h2 class="card-title">Powered by ChatNode</h2>
				<div class="form-control">
					<label class="cursor-pointer label gap-2">
						<span class="label-text">{$currentBot.settings.removeBranding ? 'Hide' : 'Show'}</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							class:toggle-success={$currentBot.settings.removeBranding}
							bind:checked={$currentBot.settings.removeBranding}
						/>
					</label>
				</div>
			</div>
		</div>
	</div>
{:else if data.subscription?.addons?.['10005']?.['status'] === 'active'}
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<h2 class="card-title">Powered by ChatNode</h2>
			<div class="form-control">
				<label class="cursor-pointer label gap-2">
					<span class="label-text">{$currentBot.settings.removeBranding ? 'Hide' : 'Show'}</span>
					<input
						type="checkbox"
						class="toggle toggle-sm"
						class:toggle-success={$currentBot.settings.removeBranding}
						bind:checked={$currentBot.settings.removeBranding}
					/>
				</label>
			</div>
			<!-- <a href="/account/settings/subscription" class="btn btn-info btn-sm disabled">Installed: Custom Domain Addon</a> -->

		</div>
	</div>
</div>
{:else}
	<div class="card bg-neutral card-compact mb-4">
		<div class="card-body">
			<div class="flex gap-4 items-center">
				<h2 class="card-title">Powered by ChatNode</h2>
				<div class="form-control">
					<label class="cursor-pointer label gap-2">
						<span class="label-text">{$currentBot.settings.removeBranding ? 'Hide' : 'Show'}</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							class:toggle-success={$currentBot.settings.removeBranding}
							bind:checked={$currentBot.settings.removeBranding}
							disabled={true}
						/>
					</label>
				</div>
				<a href="/account/settings/subscription" class="btn btn-info btn-sm">Add Custom Domain Addon</a>
			</div>
		</div>
	</div>
{/if}

<!-- Suggested Questions Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<h2 class="card-title">Suggested Questions Buttons</h2>

		<div class="flex gap-16">
			<div class="flex-col">
				<h5 class="font-bold">Orientation</h5>
				<div class="form-control mt-3">
					<label class="cursor-pointer label justify-start gap-2">
						<span class="label-text">Horizontal</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							class:toggle-success={$currentBot.settings.suggestedQuestionsStacked}
							bind:checked={$currentBot.settings.suggestedQuestionsStacked}
						/>
						<span class="label-text">Stacked</span>
					</label>
				</div>	
			</div>

			<div>
				<h5 class="font-bold">Disappear after click</h5>
				<div class="form-control mt-3">
					<label class="cursor-pointer label justify-start gap-2">
						<span class="label-text">Off</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							class:toggle-success={$currentBot.settings.suggestedQuestionsDisappear}
							bind:checked={$currentBot.settings.suggestedQuestionsDisappear}
						/>
						<span class="label-text">On</span>
					</label>
				</div>
			</div>

			<div class="flex flex-col justify-end mb-2">
				<ColorPicker
					bind:hex={$currentBot.settings.theme.suggestedQuestionsBorder}
					label="Border"
					on:input={checkIfThemeSaved}
				/>
			</div>
		</div>


		<!-- <div class="flex gap-2 items-center mt-2">
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
		</div> -->
	</div>
</div>


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
					<img src={$currentBotAvatarImg} class="w-16 mx-auto mb-2" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" alt="Avatar" />
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
					<img src={$currentBotPopupImg} class="w-16 mx-auto mb-2" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" alt="Chat Button" />
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
				width="48"
				height="48"
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
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-center ml-4 mt-1">
				<div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background-color: {$currentBot?.settings.theme.popupButtonBG}">
					<!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="{$currentBot?.settings.theme.popupButtonIcon}" class="w-8 h-8">
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg> -->
					<svg width="24" height="24" viewBox="0 0 24 24" fill="{$currentBot?.settings.theme.popupButtonBG}" xmlns="http://www.w3.org/2000/svg" stroke="{$currentBot.settings.theme.popupButtonIcon}"  stroke-width="0.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z" fill="{$currentBot.settings.theme.popupButtonIcon}"></path></svg>

				</div>
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
