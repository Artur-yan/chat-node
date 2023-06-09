<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';

	export let data;

	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	const jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${data.model.id}"><\/script>`;
	const url = `${PUBLIC_SITE_URL}/embed/${data.model.id}`;
</script>

<svelte:head>
	<title>Embed | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container">
	{#if data.model.settings.public == false}
		<div class="alert alert-warning">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<span>Your chatbot is currently set to private. To share it, you must make it public first.</span>
			<div>
				<a
					class="btn btn-sm"
					href="/account/chatbots/{data.model.id}/settings#publishing">Settings</a
				>
			</div>
		</div>
	{/if}

	<div class="grid md:grid-cols-2 gap-6 my-10">
		<div class="card bg-base-300 shadow-xl shadow-secondary/10 p-6 col-span-2">
			<div class="card-title justify-between">
				<h2 class="text-lg font-bold">Web Page</h2>
				<CopyButton textToCopy={url} />
			</div>
			<pre class="py-8 break-all whitespace-break-spaces"><code>{url}</code></pre>
		</div>
		<div class="card bg-base-300 shadow-xl shadow-secondary/10 p-6">
			<div class="card-title justify-between">
				<h2 class="text-lg font-bold">Javascript floating chatbot</h2>
				<CopyButton textToCopy={jsEmbedCode} />
			</div>
			<pre class="py-8 break-all whitespace-break-spaces"><code>{jsEmbedCode}</code></pre>
		</div>
		<p class="px-4">
			Place this code just before the closing '&lt;/body&gt;' tag. You may also place it in your
			website's '&lt;head&gt;' tag, but it is recommended to use the defer attribute to improve
			loading speed. Learn more <a
				class="link"
				href="https://www.w3schools.com/tags/att_script_defer.asp">here</a
			>.
		</p>

		<div class="card bg-base-300 shadow-xl shadow-secondary/10 p-6 md:row-start-2 md:col-start-2">
			<div class="card-title justify-between">
				<h2 class="text-lg font-bold">Embedded iframe</h2>
				<CopyButton textToCopy={iframeEmbedCode} />
			</div>
			<pre class="py-8 break-all whitespace-break-spaces"><code>{iframeEmbedCode}</code></pre>
		</div>
		<p class="px-4">
			Place this code wherever you'd like within your website where you'd like it to appear.
		</p>
	</div>
</div>

<style>
	pre::before {
		display: none;
	}
</style>
