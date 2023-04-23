<script lang="ts">
	import { updateModel, deleteModel } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	export let id: string;
	export let name: string;
	export let settings: Object;
	export let deleteEnabled = false


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

<form on:submit={handleSubmit} class="space-y-4 mb-10">
	<div>
		<label for="name" class="label">
			<span class="label-text">Name</span>
		</label>
		<input type="text" bind:value={name} class="input input-bordered input-primary w-full" />
	</div>

	<div>
		<label for="greeting" class="label">
			<span class="label-text">Greeting</span>
		</label>
		<input
			type="text"
			bind:value={settings.greeting}
			class="input input-bordered input-primary w-full"
		/>
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
		<p class="text-sm">Add specific urls you would like to allow this chatbot to be displayed on.</p>
		{#each settings.allowedUrls as url, i}
			<div class="form-control w-full max-w-lg">
				<div class="input-group">
					<input
						name="url-{i}"
						bind:value={settings.allowedUrls[i]}
						class="input input-bordered"
						placeholder="https://example.com"
					/>
					<button class="btn text-red-400" on:click={() => removeUrl(i)}
						><Icon icon="mdi:minus-circle-outline" width="16" /></button
					>
				</div>
			</div>
		{/each}
		<button class="btn" type="button" on:click={() => addUrl('')}>+ Add URL</button>
	{/if}
		<br />
		
	<div class="flex justify-between">
		<button class="btn btn-primary" type="submit">Save</button>
		{#if deleteEnabled}
				
				<label for="my-modal" class="btn"><Icon icon="mdi:delete-outline" width="16" class="mr-2" />Delete</label>
		{/if}
	</div>
</form>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Are you sure you want to delete this model?</h3>
    <p class="py-4">This can't be undone.</p>
    <div class="modal-action">
      <label for="my-modal" class="btn">Cancel</label>
	  <button class="btn btn-error" type="button" on:click={ () => { deleteModel(id); goto('/account/chatbots') } }
		>Delete</button
	>
    </div>
  </div>
</div>
