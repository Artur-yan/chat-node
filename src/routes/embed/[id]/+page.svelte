<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';

	export let data;

	let greeting = data.bot.settings.greeting;

	let messages = [
		{
			text: greeting,
			sender: 'bot'
		}
	];
</script>

<Chat modelId={data.bot.id} {messages} />	