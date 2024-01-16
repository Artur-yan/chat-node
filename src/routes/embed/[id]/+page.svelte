<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import { currentBot } from '$lib/stores.js';


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
				sizeChatToWindow()
			});
		}

	});

</script>

<svelte:head>
	<title>{data.bot.settings.publicTitle || data.bot.name}</title>
</svelte:head>

<div class="h-full flex flex-1 justify-stretch flex-col" bind:this={wrapper}>
	<iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0" title=""></iframe>
</div>
