<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let data;
	let message:string = '';

	const addUrl = (url: string) => {
		$currentBot.settings.allowedUrls = [...$currentBot.settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		$currentBot.settings.allowedUrls.splice(i, 1);
		$currentBot.settings.allowedUrls = [...$currentBot.settings.allowedUrls];
	};

	let enableEverywhere = $currentBot.settings.allowedUrls[0] == '*';

	const currentAllowedUrls = $currentBot.settings.allowedUrls;

	onMount(() => {
		if ($currentBot.settings.allowedUrls[0] == '*') {
			enableEverywhere = true;
		}
	});

	const handleEnableEverywhereChange = () => {
		if (enableEverywhere) {
			$currentBot.settings.allowedUrls = ['*'];
		} else if (currentAllowedUrls[0] !== '*') {
			$currentBot.settings.allowedUrls = currentAllowedUrls;
		} else {
			$currentBot.settings.allowedUrls = [''];
		}
	};

	const checkUrlTroubleSigns = (url: string) => {
		const urlTroubleStrings = ['http', 'www'];
		for (const troubleString of urlTroubleStrings) {
			if (url.includes(troubleString)) {
				return {
					warning: true,
					msg: "Consider removing prefixes (like 'http://' or 'www.') from the url if your bot will not load."
				};
			} else if (url.slice(-1) == '/') {
				return {
					warning: true,
					msg: "Consider removing the trailing slash ('/') from the end of url if your bot will not load."
				};
			}
		}
		return { warning: false };
	};

	const copyIdToClipboard = () => {
		navigator.clipboard.writeText($currentBot.id);
		message = 'Copied!';
		setTimeout(() => {
			message = '';
		}, 2000);
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
				If your chatbot is private, only you will be able to access it from within your ChatNode
				account.
			</div>
		{/if}
	</div>
</div>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Bot ID</h2>
		</div>
		<div class="flex gap-2 items-center">
			<input
			class="input"
			type="text"
			bind:value={$currentBot.id}
			readonly
		/>
		<button 
			class="btn btn-neutral btn-sm"
			on:click={copyIdToClipboard}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
			</svg>	
				
		</button>
		{message}
		</div>
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
					Specify URLs on which this bot should be permitted to be displayed or enable sharing
					everywhere.
				</p>
				{#if $currentBot.settings.allowedUrls.length == 0}
					<div class="alert alert-warning">
						You have not added any allowed URLs. This bot will only be accessible via the public
						url.
					</div>
				{/if}
				<label class="label cursor-pointer flex justify-start gap-4 self-start">
					<input
						type="checkbox"
						class="toggle toggle-info toggle-sm"
						bind:checked={enableEverywhere}
						on:change={handleEnableEverywhereChange}
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
								placeholder="e.g. chatnode.com"
								autofocus
								on:focusout={() => {
									if ($currentBot.settings.allowedUrls[i] === '') {
										removeUrl(i);
									}
								}}
							/>
							<button class="btn text-error/75" on:click={() => removeUrl(i)}>
								<Icon icon="mdi:minus-circle-outline" width="16" />
							</button>
						</div>
						{#if checkUrlTroubleSigns(url).warning}
							<div class="alert alert-warning">
								{checkUrlTroubleSigns(url).msg}
							</div>
						{/if}
					{/each}
					<button
						class="btn btn-sm btn-primary"
						type="button"
						on:click={() => addUrl('')}
						disabled={$currentBot.settings.allowedUrls[
							$currentBot.settings.allowedUrls.length - 1
						] === ''}
					>
						<Icon icon="mdi:plus-circle-outline" />Add URL
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<a class="btn btn-outline" href="../share">
	<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256">
		<path
			fill="currentColor"
			d="M71.68 97.22L34.74 128l36.94 30.78a12 12 0 1 1-15.36 18.44l-48-40a12 12 0 0 1 0-18.44l48-40a12 12 0 0 1 15.36 18.44Zm176 21.56l-48-40a12 12 0 1 0-15.36 18.44L221.26 128l-36.94 30.78a12 12 0 1 0 15.36 18.44l48-40a12 12 0 0 0 0-18.44ZM164.1 28.72a12 12 0 0 0-15.38 7.18l-64 176a12 12 0 0 0 7.18 15.37a11.79 11.79 0 0 0 4.1.73a12 12 0 0 0 11.28-7.9l64-176a12 12 0 0 0-7.18-15.38Z"
		/>
	</svg>
	Get Your Share Code
</a>
