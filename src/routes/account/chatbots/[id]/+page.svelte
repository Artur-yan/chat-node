<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Icon from '@iconify/svelte';

	export let data;

	let drawerOpen = false;
	let iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="border: none;"></iframe>`;
</script>

<div class="drawer drawer-end h-3/4">
	<input id="settings-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content h-3/4">
		<div class="container h-3/4">
			<div class="flex items-center py-4 justify-between gap-4">
				<div class="flex items-baseline">
					<h1 class="mr-2">{data.model.name}</h1>
					<div class="text-xs text-primary-500">id:{data.model.id}</div>
				</div>
				<div class="btn-group">
					<button class="btn btn-sm">
						<Icon icon="mdi:code" width="18" class="mr-2" />
						Embed Code
					</button>
					<label for="settings-drawer" class="drawer-button btn btn-sm btn-primary">
						<Icon icon="mdi:settings" width="18" />
						Settings
					</label>
				</div>
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
		</ul>
	</div>
</div>


<h6>Embed Code</h6>
<div class="mockup-code w-full">
	<pre><code>{iframeEmbedCode}</code></pre>
</div>