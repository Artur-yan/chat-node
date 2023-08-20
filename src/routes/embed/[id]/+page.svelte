<script lang="ts">
	import BotStatus from '$lib/components/BotStatus.svelte';
	import Chat from '$lib/components/Chat.svelte';

	export let data;


	let settings = data.bot.settings;
</script>

<svelte:head>
	<title>{data.bot.name} | ChatNode</title>
</svelte:head>

<Chat modelId={data.bot.id} {settings} avatar={data.bot.avatar_img} userId={data.bot.user_id} />
