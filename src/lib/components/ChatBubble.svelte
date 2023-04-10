<script>
	export let text = '';
	export let sender = 'bot';
</script>

<div
	class="p-4 rounded-lg max-w-2xl text-white {sender}"
	style="
		background-color: var({sender == 'bot' ? '--gptBubble' : '--userBubble'});
		color: var({sender == 'bot' ? '--gptBubbleText' : '--userBubbleText'});"
>
	{text}
</div>

<style lang="postcss">
	.user {
		@apply self-end;
	}
</style>
