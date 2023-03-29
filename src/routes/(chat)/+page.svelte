<script>
    import ColorPicker from 'svelte-awesome-color-picker';
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
    <ColorPicker bind:hex={theme.bg} label="Background Color" />
    <ColorPicker bind:hex={theme.gptBubble} label="GPT Bubble" />
    <ColorPicker bind:hex={theme.userBubble} label="User Bubble" />
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
