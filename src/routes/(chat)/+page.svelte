<script>
	import ChatWindow from './ChatWindow.svelte';
	import ChatBubble from './ChatBubble.svelte';
	import ChatInput from './ChatInput.svelte';

	let messages = ['What can I help you with?'];

	let input = '';

	function addMessage() {
		messages = [...messages, input];
		input = '';
	}

	let theme = {
		bg: '#cffafe',
		gptBubble: '#0891b2',
		userBubble: '#7dd3fc'
	};
</script>

<form class="flex bg-slate-200 p-4 m-4 gap-4 items-center">
	<label for="bgColor">Background Color</label>
	<input name="bgColor" type="text" placeholder="hex or plain text" bind:value={theme.bg} />
	<label for="bgColor">GPT Bubble Color</label>
	<input name="bgColor" type="text" placeholder="hex or plain text" bind:value={theme.gptBubble} />
	<label for="bgColor">User Bubble Color</label>
	<input name="bgColor" type="text" placeholder="hex or plain text" bind:value={theme.userBubble} />
</form>
<div class="p-4 h-[70vh]">
	<ChatWindow {messages} {theme}>
		{#each messages as message, i}
			<ChatBubble {message} side={i % 2 == 0 ? 'left' : 'right'} />
		{/each}
		<ChatInput bind:input on:submit={addMessage} />
	</ChatWindow>
</div>

<style lang="postcss">
	label {
		@apply text-sm;
	}

	input {
		@apply rounded p-2 text-sm;
	}
</style>
