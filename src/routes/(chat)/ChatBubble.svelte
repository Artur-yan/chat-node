<script>
	export let message = '';
	export let side = 'left';
	import { fade } from 'svelte/transition';

	let classes = '';

	if (side == 'right') {
		classes = 'self-end';
	}
</script>

<div
	class="p-4 rounded-lg max-w-2xl text-white {classes}"
	style="
		background-color: var({side == 'left'
			? '--gptBubble'
			: '--userBubble'});
		color: var({side == 'left'
			? '--gptBubbleText'
			: '--userBubbleText'});"
	in:fade
>
	{message}
</div>
