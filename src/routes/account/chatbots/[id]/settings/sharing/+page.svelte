<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import Icon from '@iconify/svelte';

	export let data;

	const addUrl = (url: string) => {
		$currentBot.settings.allowedUrls = [...$currentBot.settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		$currentBot.settings.allowedUrls.splice(i, 1);
		$currentBot.settings.allowedUrls = [...$currentBot.settings.allowedUrls];
	};

	let enableEverywhere = false;

	const currentAllowedUrls = $currentBot.settings.allowedUrls;

	$: enableEverywhere ? $currentBot.settings.allowedUrls = '*' : $currentBot.settings.allowedUrls = currentAllowedUrls;

	// const checkUrlTroubleSigns = (url: string) => {
	// 	const urlTroubleStrings = ['http', 'www'];
	// 	for (const troubleString of urlTroubleStrings) {
	// 		if (url.includes(troubleString)) {
	// 			return {warning: true, msg: "Consider removing prefixes like 'http://' or 'www.' from the url if you are experiencing errors."};
	// 		} else if (url.slice(-1) == '/') {
	// 			return {warning: true, msg: "Consider removing the trailing '/' from the end of url if you are experiencing errors."};
	// 		}
	// 	}
	// 	return {warning: false};
	// };

</script>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Public?</h2>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer flex justify-start gap-4 self-start">
				<span class="label-text">Private</span>
				<input
					type="checkbox"
					class="toggle toggle-warning input-success"
					bind:checked={$currentBot.settings.public}
				/>
				<span class="label-text">Public</span>
			</label>
		</div>

		{#if !$currentBot.settings.public}
			<div class="alert alert-warning">
				If your chatbot is private, only you will be able to access it from your chatbot account.
			</div>
		{/if}
	</div>
</div>

{#if $currentBot.settings.public}
	<div class="card bg-neutral card-compact mb-4">
		<div class="card-body">
			<div class="card-title">
				<h2>Allowed URLs</h2>
			</div>
			<div class="space-y-4">
				<p class="text-xs">
					Add specific urls this bot should be permitted to be displayed at or enable sharing everywhere.<br />If you
					leave this blank, you will only be able to share this chatbot via the public url.
				</p>
				<label class="label cursor-pointer flex justify-start gap-4 self-start">
					<input
						type="checkbox"
						class="toggle toggle-warning input-success toggle-sm"
						bind:checked={enableEverywhere}
					/>
					<span class="label-text">Enable everywhere</span>
				</label>
				{#if !enableEverywhere}
					{#each $currentBot.settings.allowedUrls as url, i}
						<div class="input-group">
							<input
								name="url-{i}"
								bind:value={$currentBot.settings.allowedUrls[i]}
								class="input w-full"
								placeholder="chatnode.com"
								autofocus
							/>
							<button class="btn text-error/75" on:click={() => removeUrl(i)}
								><Icon icon="mdi:minus-circle-outline" width="16" /></button
							>
						</div>
					{/each}
					<button class="btn btn-xs btn-ghost btn-primary" type="button" on:click={() => addUrl('')}
						><Icon icon="mdi:plus-circle-outline" width="16" class="mr-2" /> Add URL</button
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
