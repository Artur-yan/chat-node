<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	let settings = data.bot.settings;
	let context: string | null;
	let wrapper: HTMLDivElement;
	const { removeBranding } = data;

	function sizeChatToWindow() {
		wrapper.style.height = window.innerHeight + 'px';
	}

	onMount(() => {
		document.body.style.backgroundColor = settings.theme.bg;
		document.documentElement.style.backgroundColor = settings.theme.bg;
		const urlParams = new URLSearchParams(window.location.search);
		context = urlParams.get('context');

		if(browser && context !== 'popup') {
			wrapper.classList.remove('flex-1')
			sizeChatToWindow()
			window.addEventListener('resize', function() {
				console.log('resize')
				sizeChatToWindow()
			});
		}

	});

</script>

<svelte:head>
	<title>{data.bot.settings.publicTitle || data.bot.name}</title>
</svelte:head>

<div class="h-full flex justify-stretch flex-col" bind:this={wrapper}>
	<Chat
		modelId={data.bot.id}
		{settings}
		avatar={data.bot.avatar_img}
		userId={data.bot.user_id}
		{removeBranding}
		{context}
	/>
</div>
