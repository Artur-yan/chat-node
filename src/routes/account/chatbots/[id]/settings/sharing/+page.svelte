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
					msg: "Remove prefixes (like 'http://' or 'www.') from the url if your bot WILL NOT load."
				};
			} else if (url.slice(-1) == '/') {
				return {
					warning: true,
					msg: "Remove the trailing slash ('/') from the end of url if your bot WILL NOT load."
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
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button 
			class="btn btn-neutral btn-sm"
			on:click={copyIdToClipboard}
			on:mouseover={() => {
				message = 'Copy to clipboard';
			}}
			on:mouseleave={() => {
				message = '';
			}}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
				/>
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
					<div class="alert alert-warning text-lg">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 animate-bounce">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
						</svg>						
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
							<div class="alert alert-error border-4 border-red-600 font-bold text-lg">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 animate-bounce">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
								</svg>
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
