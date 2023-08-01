<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

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

	$: enableEverywhere ? $currentBot.settings.allowedUrls = ['*'] : $currentBot.settings.allowedUrls = currentAllowedUrls;

	onMount(() => {
		if ($currentBot.settings.allowedUrls[0] = '*') {
			enableEverywhere = true;
		}
	});

	const checkUrlTroubleSigns = (url: string) => {
		const urlTroubleStrings = ['http', 'www'];
		for (const troubleString of urlTroubleStrings) {
			if (url.includes(troubleString)) {
				return {warning: true, msg: "Consider removing prefixes (like 'http://' or 'www.') from the url if your bot will not load."};
			} else if (url.slice(-1) == '/') {
				return {warning: true, msg: "Consider removing the trailing slash ('/') from the end of url if your bot will not load."};
			}
		}
		return {warning: false};
	};

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
				<p class="text-sm">
					Specify URLs on which this bot should be permitted to be displayed or enable sharing everywhere.
				</p>
				{#if $currentBot.settings.allowedUrls.length == 0}
					<div class="alert alert-warning">
						You have not added any allowed URLs. This bot will only be accessible via the public url.
					</div>
				{/if}
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
								on:focusout={() => {console.log($currentBot.settings.allowedUrls[i]); if($currentBot.settings.allowedUrls[i] === '') {removeUrl(i)}}}
							/>
							<button class="btn text-error/75" on:click={() => removeUrl(i)}
								><Icon icon="mdi:minus-circle-outline" width="16" /></button
							>
						</div>
						{#if checkUrlTroubleSigns(url).warning}
							<div class="alert alert-warning">
								{checkUrlTroubleSigns(url).msg}
							</div>
						{/if}
					{/each}
					<button class="btn btn-xs btn-ghost btn-primary" type="button" on:click={() => addUrl('')} disabled={$currentBot.settings.allowedUrls[$currentBot.settings.allowedUrls.length - 1] === ''}
						><Icon icon="mdi:plus-circle-outline" width="16" class="mr-2" /> Add URL</button
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
