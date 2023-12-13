<script lang="ts">
	import { PUBLIC_SITE_URL, PUBLIC_CHAT_API_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Code from '$lib/components/Code.svelte';
	import { currentBot } from '$lib/stores.js';
	import { updateModel } from '$lib/models.js';
	import { alert } from '$lib/stores.js';
	import tiersMap from '$lib/data/tiers';
	import VercelCustomDomain from './VercelCustomDomain.svelte';

	export let data;

	let shareDomain
	let customDomain = false
	let shareURL
	let iframeEmbedCode
	let jsEmbedCode;
	let busyAddingCustomDomain = false;
	let busyGettingBotData = false;
	let currentCustomDomain = $currentBot.settings.customDomain;

	$: if ($currentBot.custom_domain) {
		customDomain = true;
		shareDomain = 'https://' + $currentBot.custom_domain;
		shareURL = shareDomain
	} else if ($currentBot.settings.customDomain) {
		customDomain = true
		shareDomain = 'https://' + $currentBot.settings.customDomain;
		shareURL = shareDomain
	} else {
		shareDomain = `${PUBLIC_SITE_URL}`;
		shareURL  = `${shareDomain}/embed/${data.model.id}`
	}


	$: if (customDomain) {
		iframeEmbedCode = `<iframe src="${shareDomain}" width="100%" height="700" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	} else {
		iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="700" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	}

	$: jsEmbedCode = `<script src="${
		shareDomain
	}/embed.js" data-chatbot-id="${data.model.id}" data-color-1="${
		$currentBot.settings.theme.popupButtonIcon
	}" data-color-2="${$currentBot.settings.theme.popupButtonBG}" ${
		$currentBot.settings.openChatByDefault ? 'data-open' : ''
	}><\/script>`;

	const makePublic = () => {
		$currentBot.settings.public = true;
		$currentBot.settings.allowedUrls = ['*'];
		updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
	};

	const addCustomDomain = async () => {
		busyAddingCustomDomain = true;
		const body = new FormData();
		body.append('domain', $currentBot.settings.customDomain);
		body.append('title', 'AI Chat');
		body.append('bot_id', $currentBot.id);
		body.append('user_id', data.user.userId);
		body.append('session_id', data.session.sessionId);

		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/set-subdomain`, {
			method: 'POST',
			body
		});

		if (res.ok) {
			getBotData(data.model.id);
			$alert = 'Custom Domain Added';
		} else {
			$alert = { msg: 'Something went wrong. Please try again later.', type: 'error' };
		}

		busyAddingCustomDomain = false;
	};



	const checkIfCustomDomainIsCurrent = async () => {
		if (currentCustomDomain == $currentBot.settings.customDomain) {
			return;
		} else {
			await new Promise((r) => setTimeout(r, 20000));
			getBotData(data.model.id);
			checkIfCustomDomainIsCurrent();
		}
	};

	const getBotData = async (id: string) => {
		busyGettingBotData = true;
		try {
			const res = await fetch(`/api/models/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const resData = await res.json();
			$currentBot = resData;
			currentCustomDomain = $currentBot.settings.customDomain;
		} catch (err) {
			console.error(err);
			$alert = { msg: 'Something went wrong', type: 'error' };
		} finally {
			busyGettingBotData = false;
		}
	};

</script>

<svelte:head>
	<title>Embed | {data.model.name} | ChatNode</title>
</svelte:head>

<div
	class="container my-4 py-8 grid grid-cols-1 gap-8"
>
	<div>
		<div class="relative">
			{#if !$currentBot.settings.public && !$currentBot.custom_domain}
				<div class="inset-0 absolute bg-base-100/70 z-10 flex items-center justify-center">
					<div class="card bg-neutral max-w-2xl">
						<div class="card-body">
							<h2 class="card-title">Your chatbot is currently set to private.</h2>
							<p class="text-lg">
								Currently it may only be integrated with slack. To embed it or get a share url make
								your bot public. You can choose to only allow it on specific URLs in the share
								settings.
							</p>
							<div class="card-actions mt-8">
								<a class="btn" href="/account/chatbots/{data.model.id}/settings/sharing">
									Share Settings
								</a>
								<button class="btn btn-success" on:click={makePublic}>Make Public</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
			<div>
				<h2 class="card-title">Bot ID</h2>
				<div class="bg-neutral p-4 rounded-lg flex justify-between items-center mb-8">
					<div>
						{$currentBot.id}
						<CopyButton textToCopy={$currentBot.id} />
					</div>
				</div>
			</div>
			<div>
				<h2 class="card-title">Web Page</h2>
				<div class="bg-neutral p-4 rounded-lg flex justify-between items-center mb-8">
					<div>
						{shareURL}
						<CopyButton textToCopy={shareURL} />
					</div>
					<a href={shareURL} class="btn btn-xs" target="_blank">view</a>
				</div>
			</div>
			<div class="relative">
				{#if data.model.settings.public && data.model.settings.allowedUrls.length === 0}
					<div class="inset-0 absolute bg-base-100/70 z-10 flex items-center justify-center">
						<div class="card bg-neutral max-w-2xl">
							<div class="card-body">
								<h2 class="card-title">You have not defined any allowed URLS.</h2>
								<p class="text-lg">
									To embed your chatbot on a website, you must specify the URLs you would like to be
									allowed access from your share settings.
								</p>
								<div class="card-actions mt-8">
									<a class="btn" href="/account/chatbots/{data.model.id}/settings/sharing">
										Settings
									</a>
								</div>
							</div>
						</div>
					</div>
				{/if}
				<div class="mb-8">
					<h2 class="card-title">Popup Chat</h2>
					<div>
						<div>
							<Code code={jsEmbedCode} />
						</div>
						<div class="flex justify-between text-sm mt-2">
							<p>Place this code in your &lt;head&gt; tag.</p>
							<a class="btn btn-xs btn-primary" href="settings/customize">Customize</a>
						</div>
					</div>
				</div>
				<div>
					<div class="mb-8">
						<h2 class="card-title">Embedded (iframe)</h2>
						<Code code={iframeEmbedCode} />
						<p class="text-sm my-2">
							Place this code wherever you'd like the iframe to appear on your website.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if (data.subscription?.plan === 1006) || (data.subscription?.addons?.['10005']?.['status'])}
		<VercelCustomDomain />

		<!-- Legacy Domain -->
		{#if $currentBot.settings.customDomain}
			<div class="card bg-neutral mb-12">
				<div class="card-body">
					<h2 class="card-title justify-between">
						Legacy Custom Domain
						<button
							class="btn btn-sm"
							on:click={() => getBotData(data.model.id)}
							disabled={busyGettingBotData}
						>
							{#if busyGettingBotData}
								<span class="loading loading-spinner text-primary mr-2 loading-sm" />
							{/if}
							Check for changes
						</button>
					</h2>
					<div>
						<form on:submit|preventDefault={addCustomDomain} class="mb-8">
							<div class="form-control">
								<label class="label" for="domain">
									<span class="label-text">Your sub-domain name</span>
								</label>
								<div class="join">
									<input
										type="text"
										class="input join-item w-full"
										name="domain"
										bind:value={$currentBot.settings.customDomain}
									/>
									<button
										type="submit"
										class="btn btn-success join-item"
										disabled={busyAddingCustomDomain}
									>
										{#if busyAddingCustomDomain}
											<span class="loading loading-spinner text-primary mr-2 loading-sm" />
										{/if}
										{busyAddingCustomDomain ? 'Adding' : 'Submit'}
									</button>
								</div>
								<span class="help">
									Must be a valid sub-domain and you must be able to edit the DNS records for the
									domain
								</span>
							</div>
						</form>
						{#if currentCustomDomain}
							<div class="overflow-x-auto">
								<p class="text-warning text-sm font-bold mb-2">
									Add this entry to your DNS records for {currentCustomDomain
										.split('.')
										.slice(-2)
										.join('.')}:
								</p>
								<table class="table table-lg bg-base-300 rounded">
									<!-- head -->
									<thead>
										<tr>
											<th>Type</th>
											<th>Host</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<!-- row 1 -->
										<tr>
											<th>CNAME</th>
											<td>{currentCustomDomain.split('.').slice(0, -2).join('.')}</td>
											<td>lkjink.com.</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="alert alert-warning mt-4">
								Please Allow up to 24 Hours for the changes to take effect and for your SSL
								certificate to be generated. If you are still experiencing issues, contact us at
								contact@chatnode.ai.
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style lang="postcss">
	pre {
		@apply break-all whitespace-break-spaces opacity-50 text-sm;
	}

	pre::before {
		display: none;
	}
</style>
