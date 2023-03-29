<script>
	export let theme = {
		bg: '',
		gptBubble: '',
		userBubble: '',
		gptBubbleText: '',
		userBubbleText: ''
	};
</script>

<section
	class="flex flex-col w-full justify-between p-2 rounded-lg h-full items-start"
	style="
		--bg: {theme.bg};
		--gptBubble: {theme.gptBubble};
		--userBubble: {theme.userBubble};
		--gptBubbleText: {theme.gptBubbleText};
		--userBubbleText: {theme.userBubbleText};
		background-color: var(--bg)"
>
	<div class="flex flex-col w-full gap-2 items-start overflow-scroll pb-4">
		<slot name="messages" />
	</div>
	<div class="w-full">
		<slot name="input" />
	</div>
</section>
