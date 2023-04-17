<script lang="ts">
	import { updateModel } from '$lib/models';
	import Icon from '@iconify/svelte';

	export let id: string;
	export let name: string;
	export let settings: Object;

	const addUrl = (url: string) => {
		settings.allowedUrls = [...settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		settings.allowedUrls.splice(i, 1);
		settings.allowedUrls = [...settings.allowedUrls];
	};
</script>

<form on:submit={updateModel(id, name, settings)} class="space-y-4 mb-10">
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
	<div class="form-control w-64">
		<label class="label cursor-pointer">
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
	<button class="btn btn-primary" type="submit">Save</button>
</form>
