<script lang="ts">
	import { updateModel, defaultSettings } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { invalidateAll } from '$app/navigation';
	import { alert } from '$lib/stores';

	export let id: string;
	export let name: string;
	export let settings = defaultSettings;

	let busySaving = false;

	const handleSubmit = async () => {
		busySaving = true;
		await updateModel(id, name, settings);
		busySaving = false;
		$alert = { msg: 'Settings Saved', type: 'success' };
		invalidateAll();
	};

	if (!settings.gptVersion) {
		settings.gptVersion = '3.5';
	}
	if (settings.temperature === undefined) {
		settings.temperature = 0.1;
	}
</script>

<div>
	<form on:submit={handleSubmit} class="grid gap-10 pb-32">
		<div>
			<label for="name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input type="text" bind:value={name} class="input input-lg w-full" placeholder="Untitled" />
		</div>

		<label for="my-modal" class="btn btn-error btn-sm btn-outline btn-circle mx-auto"
			><Icon icon="mdi:delete-outline" width="16" /></label
		>
		<div class="fixed bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
			<button class="btn btn-outline btn-success md:w-40" type="submit">
				<span class={busySaving ? 'loading' : 'invisible'} />

				Save</button
			>
		</div>
	</form>
</div>
