<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';

	export let data;
	let color1 = "#3ABFF7"
	let color2 = "#0E1729"

	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility='visible';"></iframe>`;
	let jsEmbedCode;
	const url = `${PUBLIC_SITE_URL}/embed/${data.model.id}`;

	$: jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${data.model.id}" color-1="${color1}" color-2="${color2}"><\/script>`;

</script>

<svelte:head>
	<title>Embed | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container">
	{#if data.model.settings.public == false}
		<div class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span
				>Your chatbot is currently set to private. To share it, you must make it public first.</span
			>
			<div>
				<a class="btn btn-sm" href="/account/chatbots/{data.model.id}/settings#publishing"
					>Settings</a
				>
			</div>
		</div>
	{/if}

	<h2 class="text-lg font-bold">Web Page</h2>				
	<pre><code>{url}</code><CopyButton textToCopy={url} /></pre>

	<h2 class="text-lg font-bold mt-10">Popup Chat</h2>
	<div class="grid md:grid-cols-2">
		<div class="bg-neutral p-4 rounded flex flex-col justify-between">
			<div class="flex justify-between">
				<pre><code>{jsEmbedCode}</code></pre>
				<!-- <div class="tabs tab-sm mb-4">
					<button class="tab tab-bordered tab-active">Code</button> 
					<button class="tab tab-bordered">Customize</button> 
				</div> -->
				<CopyButton textToCopy={jsEmbedCode} />
			</div>
			<p class="text-sm mt-4">Place this code just before your website's closing &lt;/body&gt; or &lt;/head&gt; tag.</p>
		</div>
		<div class="p-4">
			<h4 class="font-bold">Customise</h4>
			<div class="flex gap-4 mt-4">
				<ColorPicker bind:hex={color1} label="Button Color 1" />
				<ColorPicker bind:hex={color2} label="Button Color 2" />
			</div>
			<p class="text-sm mt-4">To change the colors of the chat window, visit the 'theme' section on the <a class="link" href="settings">settings page</a>.</p>
		</div>
	</div>

	<h2 class="text-lg font-bold mt-10">Embedded (iframe)</h2>
	<div class="grid md:grid-cols-2">
		<div class="bg-neutral p-4 rounded flex flex-col justify-between">
			<div class="flex justify-between">
				<pre><code>{iframeEmbedCode}</code></pre>

				<CopyButton textToCopy={iframeEmbedCode} />
			</div>
			<p class="text-sm mt-4">Place this code wherever you'd like within your website where you'd like it to appear.</p>
		</div>
		<div class="p-4">
		</div>
	</div>
</div>

<style lang="postcss">
	pre{
		@apply break-all whitespace-break-spaces opacity-50 text-sm;
	}

	pre::before {
		display: none;
	}
</style>
