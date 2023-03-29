<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import ChatWindow from './ChatWindow.svelte';
	import ChatBubble from './ChatBubble.svelte';
	import ChatInput from './ChatInput.svelte';

	let messages = ['What can I help you with?'];

	let input = '';

	let thinking = false;

	const queryGPT = async (message: string) => {
		input = '';
		messages = [...messages, message];
		thinking = true;
		await fetch('https://chat-base-xxvbz.ondigitalocean.app/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: message
			})
		})
		.then(res => res.json())
		.then((data) => {
			console.log(data)		
			messages = [...messages, data.detail];
			thinking = false;
		})
		.catch((err) => {
			thinking = false;
			console.error(err);
			messages = [...messages, "I'm sorry, something went wrong."];
		});
	}

	let theme = {
		bg: '#cffafe',
		gptBubble: '#0891b2',
		gptBubbleText: '#fff',
		userBubble: '#7dd3fc',
		userBubbleText: '#fff'
	};

	let gptBubbleHSV;
	let userBubbleHSV;

	$: {
		gptBubbleHSV !== undefined && gptBubbleHSV.v > 50
			? (theme.gptBubbleText = '#000')
			: (theme.gptBubbleText = '#fff');
		userBubbleHSV !== undefined && userBubbleHSV.v > 50
			? (theme.userBubbleText = '#000')
			: (theme.userBubbleText = '#fff');
	}
</script>

<form class="flex p-4 gap-4 items-center">
	<ColorPicker bind:hex={theme.bg} label="Background Color" />
	<ColorPicker bind:hsv={gptBubbleHSV} bind:hex={theme.gptBubble} label="GPT Bubble" />
	<ColorPicker bind:hsv={userBubbleHSV} bind:hex={theme.userBubble} label="User Bubble" />
</form>
<div class="p-4 h-[70vh]">
	<ChatWindow {messages} {theme}>
		{#each messages as message, i}
			<ChatBubble {message} side={i % 2 == 0 ? 'left' : 'right'} />
		{/each}
		{#if thinking}
			<ChatBubble message="Thinking..." side="left" />
		{/if}
		<ChatInput bind:input on:submit={() => queryGPT(input)} />
	</ChatWindow>
</div>
