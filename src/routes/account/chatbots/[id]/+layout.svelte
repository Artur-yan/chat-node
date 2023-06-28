<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	const chatPath = `/account/chatbots/${data.model.id}`;
	const sharePath = `/account/chatbots/${data.model.id}/share`;
	const integrationsdPath = `/account/chatbots/${data.model.id}/integrations`;
	const dataPath = `/account/chatbots/${data.model.id}/data`;
	const settingsPath = `/account/chatbots/${data.model.id}/settings`;
	const historyPath = `/account/chatbots/${data.model.id}/history`;
</script>

<div class="container sm:flex items-center mb-4 gap-4 flex-wrap">
	<div class="flex items-baseline gap-2 text-secondary">
		<a class="text-sm font-bold" href="/account/chatbots">Bots</a>
		<span class="mx-1 text-xs">/</span>
		<h1 class="font-bold">{data.model.name}</h1>
	</div>
	<div class="tabs tabs-boxed bg-neutral">
		<a href={chatPath} class="tab" class:tab-active={chatPath == $page.url.pathname}>Chat</a>
		<a href={sharePath} class="tab" class:tab-active={sharePath == $page.url.pathname}>Share</a>
		<a
			href={integrationsdPath}
			class="tab"
			class:tab-active={integrationsdPath == $page.url.pathname}>Integrations</a
		>
		<a href={dataPath} class="tab" class:tab-active={dataPath == $page.url.pathname}>Data</a>
		<a href={historyPath} class="tab" class:tab-active={historyPath == $page.url.pathname}>History</a>
		<a href={settingsPath} class="tab" class:tab-active={settingsPath == $page.url.pathname}
			>Settings</a
		>
	</div>
</div>

<slot />
