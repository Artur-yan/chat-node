<script lang="ts">
	import { updateModel, deleteModel, defaultSettings } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { alert } from '$lib/stores';
	import Accordian from '$lib/components/Accordian.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';

	export let id: string;
	export let name: string;
	export let settings = defaultSettings;
	export let open = false;
	let busySaving = false;
	let deleting = false;

	$: settings.theme = themes[selectedTheme];

	const addUrl = (url: string) => {
		settings.allowedUrls = [...settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		settings.allowedUrls.splice(i, 1);
		settings.allowedUrls = [...settings.allowedUrls];
	};

	const handleSubmit = async () => {
		busySaving = true;
		await updateModel(id, name, settings);
		busySaving = false;
		$alert = 'Settings Saved';
		invalidateAll()
	};

	let selectedTheme = settings.theme.name || 'default';
</script>

<div>
	<form on:submit={handleSubmit} class="grid gap-10 pb-32">
		<div>
			<label for="name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input type="text" bind:value={name} class="input w-full" placeholder="Untitled" />
		</div>
		<Accordian {open}>
			<div slot="title">Messages</div>
			<div>
				<label for="greeting" class="label">
					<span class="label-text">Greeting</span>
				</label>
				<input type="text" bind:value={settings.greeting} class="input w-full" />
			</div>
			<div>
				<label for="support-message" class="label">
					<span class="label-text">Support Message</span>
				</label>
				<input type="text" bind:value={settings.supportMessage} class="input w-full" />
				<p class="text-sm m-1">
					This is the message that will appear to the user if the chatbot cannot come up with a
					confident answer. You may want to include an email address or link to a contact page here.
				</p>
			</div>
		</Accordian>
		<Accordian {open}>
			<div slot="title">Prompts</div>

			<div>
				<div>
					<label for="system-prompt" class="label">
						<span class="label-text">System Prompt</span>
					</label>
					<textarea
						bind:value={settings.systemPrompt}
						class="textarea textarea-bordered w-full leading-normal"
						name="prompt"
						rows="5"
					/>
				</div>
				<div>
					<label for="user-prompt" class="label">
						<span class="label-text">User Prompt</span>
					</label>
					<textarea
						bind:value={settings.userPrompt}
						class="textarea textarea-bordered w-full"
						name="user-prompt"
					/>
				</div>
			</div>
		</Accordian>
		<Accordian {open}>
			<div slot="title" id="publishing">Publishing</div>
			<div>
				<div class="form-control">
					<label class="label cursor-pointer flex justify-start gap-4 self-start">
						<span class="label-text">Private</span>
						<input
							type="checkbox"
							class="toggle toggle-warning input-success"
							bind:checked={settings.public}
						/>
						<span class="label-text">Public</span>
					</label>
				</div>
				{#if settings.public}
					<div class="space-y-4">
						<p class="text-xs">
							Add specific urls you would like to allow this chatbot to be displayed on.
						</p>
						{#each settings.allowedUrls as url, i}
							<div class="input-group">
								<input
									name="url-{i}"
									bind:value={settings.allowedUrls[i]}
									class="input w-full"
									placeholder="https://example.com"
									autofocus
								/>
								<button class="btn text-error/75" on:click={() => removeUrl(i)}
									><Icon icon="mdi:minus-circle-outline" width="16" /></button
								>
							</div>
						{/each}
						<button
							class="btn btn-xs btn-ghost btn-primary"
							type="button"
							on:click={() => addUrl('')}
							><Icon icon="mdi:plus-circle-outline" width="16" class="mr-2" /> Add URL</button
						>
					</div>
				{/if}
			</div>
		</Accordian>
		<Accordian {open}>
			<div slot="title" id="theme">Theme</div>
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
				<div class="grid grid-cols-2 gap-4 my-4">
					<ColorPicker bind:hex={settings.theme.bg} isPopup={false} label="Background" />
					<ColorPicker
						bind:hex={settings.theme.botBubbleBG}
						isPopup={false}
						label="Bot Bubble Background"
					/>
					<ColorPicker
						bind:hex={settings.theme.botBubbleText}
						isPopup={false}
						label="Bot Bubble Text"
					/>
					<ColorPicker
						bind:hex={settings.theme.userBubbleBG}
						isPopup={false}
						label="User Bubble Background"
					/>
					<ColorPicker
						bind:hex={settings.theme.userBubbleText}
						isPopup={false}
						label="User Bubble Text"
					/>
					<ColorPicker bind:hex={settings.theme.inputBG} isPopup={false} label="Input Background" />
					<ColorPicker bind:hex={settings.theme.inputText} isPopup={false} label="Input Text" />
					<ColorPicker bind:hex={settings.theme.inputBorder} isPopup={false} label="Input Border" />
					<ColorPicker
						bind:hex={settings.theme.sendButtonBG}
						isPopup={false}
						label="Send Button Background"
					/>
					<ColorPicker
						bind:hex={settings.theme.sendButtonIconColor}
						isPopup={false}
						label="Send Button Icon"
					/>
				</div>
			{/if}
		</Accordian>
		<label for="my-modal" class="btn btn-error btn-sm btn-outline btn-circle mx-auto opacity-60"
			><Icon icon="mdi:delete-outline" width="16" /></label
		>
		<div class="fixed bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
			<button class="btn btn-outline btn-success md:w-40" type="submit" class:loading={busySaving}
				>Save</button
			>
		</div>
	</form>
</div>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to delete this chatbot?</h3>
		<p class="py-4">This can't be undone</p>
		<div class="modal-action">
			<label for="my-modal" class="btn">Cancel</label>
			<button
				class="btn btn-error"
				class:loading={deleting}
				type="button"
				on:click={async () => {
					deleting = true;
					await deleteModel(id);
					goto('/account/chatbots');
				}}
			>
				Delete</button
			>
		</div>
	</div>
</div>

<style lang="postcss">
	input {
		@apply input-bordered;
	}

	.themes {
		@apply flex items-center gap-2 flex-wrap;
	}

	.themes label {
		@apply btn btn-sm;
	}

	.themes input:checked + label {
		@apply btn-primary;
	}

	:global(.color-picker .container) {
		padding: 0;
		max-width: none;
		width: auto;
		margin: 0;
	}
</style>
