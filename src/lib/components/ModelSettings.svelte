<script lang="ts">
	import { updateModel, deleteModel } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	export let id: string;
	export let name: string;
	export let settings: Object;
	export let deleteEnabled = false
	let deleting = false


	const addUrl = (url: string) => {
		settings.allowedUrls = [...settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		settings.allowedUrls.splice(i, 1);
		settings.allowedUrls = [...settings.allowedUrls];
	};

	const handleSubmit = () => {
		updateModel(id, name, settings);
	};
</script>

<form on:submit={handleSubmit} class="space-y-4 mb-10 bg-neutral p-4 rounded-lg">
	<div>
		<label for="name" class="label">
			<span class="label-text">Name</span>
		</label>
		<input type="text" bind:value={name} class="input w-full" placeholder="Untitled" />
	</div>

	<div>
		<label for="greeting" class="label">
			<span class="label-text">Greeting</span>
		</label>
		<input
			type="text"
			bind:value={settings.greeting}
			class="input w-full"
		/>
	</div>
	<div>
		<label for="support-message" class="label">
			<span class="label-text">Support Message</span>
		</label>
		<input
			type="text"
			bind:value={settings.supportMessage}
			class="input w-full"
		/>
		<p class="text-sm m-1">This is the message that will appear to the user if the chatbot cannot come up with a confident answer. You may want to include an email address or link to a contact page here.</p>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer flex justify-start gap-4">
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
		<p class="text-xs">Add specific urls you would like to allow this chatbot to be displayed on.</p>
		{#each settings.allowedUrls as url, i}
			<div class="form-control w-full">
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
			</div>
		{/each}
			<button class="btn btn-xs btn-outline btn-primary btn-circle" type="button" on:click={() => addUrl('')}><Icon icon="mdi:add" width="16" /></button>
	{/if}
	<div class="text-center">
		<button class="btn btn-outline btn-success w-full max-w-2xl mt-10" type="submit">Save</button>
	</div>
</form>
{#if deleteEnabled}				
	<div class="text-center">
		<label for="my-modal" class="btn btn-error btn-sm btn-outline btn-circle"><Icon icon="mdi:delete-outline" width="16" /></label>
	</div>
{/if}

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Are you sure you want to delete this model?</h3>
    <p class="py-4">This can't be undone.</p>
    <div class="modal-action">
		<label for="my-modal" class="btn">Cancel</label>
		<button class="btn btn-error" type="button"
			on:click={
				async () => {
					deleting = true;
					await deleteModel(id);
					goto('/account/chatbots')
				}
			}
		>
			{#if deleting}
				<Icon icon="mdi:loading" class="animate-spin mr-2" width="20" />
			{/if}
		Delete</button
	>
    </div>
  </div>
</div>
