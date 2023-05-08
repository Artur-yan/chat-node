<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	const chatPath = `/account/chatbots/${data.model.id}`
	const embedPath = `/account/chatbots/${data.model.id}/embed`
	const dataPath = `/account/chatbots/${data.model.id}/data`
	const settingsPath = `/account/chatbots/${data.model.id}/settings`
</script>

<div class="container sm:flex items-center mb-4 gap-4 flex-wrap">
	<div class="flex items-center gap-2 text-secondary -ml-8">
		<a class="btn btn-ghost btn-circle btn-sm" href="/account/chatbots">&larr;</a>
		<h1 class="font-bold">{data.model.name}</h1>
	</div>
	<div class="tabs tabs-boxed">
		<a href={chatPath} class="tab" class:tab-active={chatPath == $page.url.pathname}>Chat</a> 
		<a href={embedPath} class="tab" class:tab-active={embedPath == $page.url.pathname}>Embed</a> 
		<a href={dataPath} class="tab" class:tab-active={dataPath == $page.url.pathname}>Data</a> 
		<a href={settingsPath} class="tab" class:tab-active={settingsPath == $page.url.pathname}>Settings</a> 
	  </div>
</div>

<slot />
