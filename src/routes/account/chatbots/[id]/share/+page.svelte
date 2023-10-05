<script lang="ts">
	import { PUBLIC_SITE_URL, PUBLIC_CHAT_API_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Code from '$lib/components/Code.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { currentBot } from '$lib/stores.js';
	import { updateModel } from '$lib/models.js';

	export let data;

	let color1 = '#3ABFF7';
	let color2 = '#0E1729';
	let openChatByDefault = false;
	let jsEmbedCode;

	console.log(data)
	console.log($currentBot)

	const plansWithSlackIntegration = [2, 3, 4, 5, 102, 103, 104, 105, 1001, 1002, 1003, 1004, 1005];
	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="700" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	const url = `${PUBLIC_SITE_URL}/embed/${data.model.id}`;

	$: jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${
		data.model.id
	}" data-color-1="${color1}" data-color-2="${color2}" ${
		openChatByDefault ? 'data-open' : ''
	}><\/script>`;

	const makePublic = () => {
		$currentBot.settings.public = true;
		$currentBot.settings.allowedUrls = '*'
		updateModel($currentBot.id, $currentBot.name, $currentBot.settings)
	}

	const addDomain = async () => {
		const body = new FormData();
		body.append('domain', 'example.com');
		body.append('title', 'AI Chat');
		body.append('bot_id', $currentBot.id);
		body.append('user_id', data.user.user.userId);
		body.append('session_id', data.user.session.sessionId);

		await fetch(`${PUBLIC_CHAT_API_URL}/api/set-subdomain`, {
			method: 'POST',
			body,
		});
	}


</script>

<svelte:head>
	<title>Embed | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container my-4 py-8">
	<div class="relative">
		{#if !$currentBot.settings.public}
			<div class="inset-0 absolute bg-base-100/70 z-10 flex items-center justify-center">
				<div class="card bg-neutral max-w-2xl">
					<div class="card-body">
						<h2 class="card-title">Your chatbot is currently set to private.</h2>
						<p class="text-lg">
							Currently it may only be integrated with slack. To embed it or get a share url make
							your bot public. You can choose to only allow it on specific URLs in the share settings.
						</p>
						<div class="card-actions mt-8">
							<a class="btn" href="/account/chatbots/{data.model.id}/settings/sharing">Share Settings</a>
							<button class="btn btn-success" on:click={makePublic}>Make Public</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div>
			<h2 class="card-title">Web Page</h2>
			<div class="bg-neutral p-4 rounded-lg flex justify-between items-center mb-12">
				<div>
					{url}
					<CopyButton textToCopy={url} />
				</div>
				<a href={url} class="btn btn-xs" target="_blank">view</a>
			</div>
		</div>
		{#if data.subscription?.plan === 1 }
			<div class="card bg-neutral mb-12">
				<div class="card-body">
					<h2 class="card-title">Enable Custom Domain</h2>
					<form>
						<div class="form-control">
							<label class="label" for="domain">
								<span class="label-text">Your domain name</span>
							  </label>							
							<input type="text" class="input" name="domain" />
						</div>
						<input type="submit" class="btn btn-success mt-4" value="Submit" />
					</form>
				</div>
			</div>
		{/if}

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
			<div class="mb-12">
				<h2 class="card-title">Popup Chat</h2>
				<div>
					<div>
						<Code code={jsEmbedCode} />
					</div>
					<p class="text-sm my-2">Place this code in your &lt;head&gt; tag.</p>
					<div class="mt-10">
						<h4 class="font-bold">Customise</h4>
						<div class="flex gap-4 mt-4">
							<ColorPicker bind:hex={color1} label="Icon Color" />
							<ColorPicker bind:hex={color2} label="Background Color" />
						</div>
						<p class="text-sm mt-4">
							To further customize the design visit the <a class="link" href="settings/customize">
								settings page
							</a>
							.
						</p>
						<div class="form-control mt-4">
							<label class="label cursor-pointer justify-start gap-2">
								<input type="checkbox" class="toggle" bind:checked={openChatByDefault} />
								<span class="label-text">Open chat window by default</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div class="mb-10">
					<h2 class="card-title">Embedded (iframe)</h2>
					<Code code={iframeEmbedCode} />
					<p class="text-sm my-2">
						Place this code wherever you'd like the iframe to appear on your website.
					</p>
				</div>
			</div>
		</div>
	</div>
	<div>
		<h2 class="card-title">Slack</h2>
		<div class="card bg-neutral">
			<div class="card-body">
				<p class="text-base text-neutral-content">
					Get responses from your custom trained chatbot directly in slack for you and your team.
				</p>
				<div class="card-actions justify-between mt-10 items-center">
					{#if plansWithSlackIntegration.includes(data.subscription.plan)}
						{#if data.model.slack_bot_status === false}
							<a class="btn btn-primary" href="{PUBLIC_CHAT_API_URL}/slack/install">
								Authorize Slack
							</a>
						{:else}
							<div class="badge badge-outline badge-success">Enabled</div>
							<a class="btn btn-xs" href="{PUBLIC_CHAT_API_URL}/slack/install">+ Slack Workspace</a>
						{/if}
					{:else}
						<p class="text-warning text-sm">
							Slack integration is available on the pro plan and above
						</p>
						<a class="btn btn-warning" href="/account/settings/subscription">Upgrade</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	pre {
		@apply break-all whitespace-break-spaces opacity-50 text-sm;
	}

	pre::before {
		display: none;
	}
</style>
