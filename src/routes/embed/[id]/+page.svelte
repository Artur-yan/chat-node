<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { onMount } from 'svelte';

	export let data;

	let settings = data.bot.settings;

	const { removeBranding } = data

	onMount(() => {
		document.body.style.backgroundColor = settings.theme.bg;
		document.documentElement.style.backgroundColor = settings.theme.bg;
	});
</script>

<svelte:head>
	<title>{data.bot.name} | ChatNode</title>
</svelte:head>

<Chat modelId={data.bot.id} {settings} avatar={data.bot.avatar_img} userId={data.bot.user_id} {removeBranding} />
