<script>
	export let message = '';
	export let side = 'left';

    let classes = '';

	if (side == 'right') {
		classes = 'self-end';
	}
</script>

<div class="p-4 rounded-lg max-w-2xl text-white {classes}" style="background-color: var({side == 'left' ? '--gptBubble' : '--userBubble'})">
	{message}
</div>
