<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;

	import { PUBLIC_SITE_URL } from '$env/static/public';
	import ModelSettings from '$lib/components/ModelSettings.svelte';

	let drawerOpen = false;


	let iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="border: none;"></iframe>`;

	let chatInput: HTMLInputElement;
	let input: string;

</script>

<div class="drawer drawer-end h-full">
	<input id="settings-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content h-full">
		<div class="container h-full">
			<div class="flex items-center py-4 justify-between gap-4">
				<div class="flex items-baseline">
					<h1 class="mr-2">{data.model.name}</h1>
					<div class="text-xs text-primary-500">id:{data.model.id}</div>
				</div>
				<label for="settings-drawer" class="drawer-button btn btn-primary">Settings</label>
			</div>
			{@html iframeEmbedCode}
		</div>
	</div>
	<div class="drawer-side">
		<label for="settings-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-full md:w-2/3 lg:w-1/2 bg-base-100 text-base-content">
			<div class="flex items-center justify-between mb-4">
				<h5>Settings</h5>	
			</div>
			<ModelSettings id={data.model.id} name={data.model.name} settings={data.model.settings} />
			<h6>Embed Code</h6>
			<div class="mockup-code w-full">
				<pre><code>{iframeEmbedCode}</code></pre>
			</div>
		</ul>
	</div>
</div>
