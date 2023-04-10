<script>
	export let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF',
		input: '#FFFFFF',
		inputText: '#222222'
	};
</script>

<section
	class="flex flex-col w-full justify-between p-4 rounded-lg h-full items-start"
	style="
		--bg: {theme.bg};
		--gptBubble: {theme.gptBubble};
		--userBubble: {theme.userBubble};
		--gptBubbleText: {theme.gptBubbleText};
		--userBubbleText: {theme.userBubbleText};
		--input: {theme.input};
		--inputText: {theme.inputText};
		background-color: var(--bg)"
>
	<div class="flex flex-col w-full gap-2 items-start overflow-auto pb-4">
		<slot name="messages" />
	</div>
	<div class="w-full">
		<slot name="input" />
	</div>
</section>
