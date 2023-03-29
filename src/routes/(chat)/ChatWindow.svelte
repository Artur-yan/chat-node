<script>
	export let theme = {
		bg: 'red',
		gptBubble: 'purple',
		userBubble: 'blue'
	};
</script>

<section
	class="relative p-2 rounded-lg h-full flex flex-col items-start"
	style="--bg: {theme.bg}; --gptBubble: {theme.gptBubble}; --userBubble: {theme.userBubble}; background-color: var(--bg)"
>
	<slot />
</section>
