<script lang="ts">
	import { PUBLIC_SITE_URL, PUBLIC_CHAT_API_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Code from '$lib/components/Code.svelte';	
	import ColorPicker from 'svelte-awesome-color-picker';
	
	export let data;
	
	let color1 = '#3ABFF7';
	let color2 = '#0E1729';
	let openChatByDefault = false;
	let jsEmbedCode;
	
	const plansWithSlackIntegration = [2, 3, 4, 5, 102, 103, 104, 105, 1001, 1002, 1003, 1004, 1005];
	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	const url = `${PUBLIC_SITE_URL}/embed/${data.model.id}`;

	$: jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${
		data.model.id
	}" data-color-1="${color1}" data-color-2="${color2}" ${
		openChatByDefault ? 'data-open' : ''
	}><\/script>`;
</script>

<svelte:head>
	<title>Embed | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container my-10">
	{#if data.model.settings.public == false}
		<div class="alert alert-warning mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>
				Your chatbot is currently set to private. To share it, you must make it public first.
			</span>
			<div>
				<a class="btn btn-sm" href="/account/chatbots/{data.model.id}/settings/sharing">Settings</a>
			</div>
		</div>
	{/if}

	<div class="md:grid md:grid-cols-2 gap-12">

		<div class="mb-12">
			<h2 class="card-title">Popup Chat</h2>

			<div>
				<div>
					<Code code={jsEmbedCode} />
				</div>
				<p class="text-sm my-2">
					Place this code in your &lt;head&gt; tag.
				</p>
				<div class="mt-10">
					<h4 class="font-bold">Customise</h4>
					<div class="flex gap-4 mt-4">
						<ColorPicker bind:hex={color1} label="Icon Color" />
						<ColorPicker bind:hex={color2} label="Background Color" />
					</div>
					<p class="text-sm mt-4">
						To further customize the design visit the <a
							class="link"
							href="settings/customize"
						>
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
			<h2 class="card-title">Web Page</h2>
			<div class="bg-neutral p-4 lg:p-8 rounded-lg flex justify-between items-center mb-12">
				<div>
					{url}
					<CopyButton textToCopy={url} />
				</div>
				<a href={url} class="btn btn-xs" target="_blank">view</a>
			</div>

			<div class="mb-10">
				<h2 class="card-title">Embedded (iframe)</h2>
		
				<Code code={iframeEmbedCode} />
				<p class="text-sm my-2">
					Place this code wherever you'd like the iframe to appear on your website.
				</p>
			</div>

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




	
</div>

<style lang="postcss">
	pre {
		@apply break-all whitespace-break-spaces opacity-50 text-sm;
	}

	pre::before {
		display: none;
	}
</style>
