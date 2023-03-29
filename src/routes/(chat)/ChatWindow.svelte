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
	class="relative p-2 rounded-lg h-full flex flex-col items-start"
	style="
		--bg: {theme.bg};
		--gptBubble: {theme.gptBubble};
		--userBubble: {theme.userBubble};
		--gptBubbleText: {theme.gptBubbleText};
		--userBubbleText: {theme.userBubbleText};
		background-color: var(--bg)"
>
	<slot />
</section>
