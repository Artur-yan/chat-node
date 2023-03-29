<script>
	export let input = '';
</script>

<form class="absolute bottom-2 left-2 right-2" on:submit>
	<input
		type="text"
		placeholder="type your message"
		bind:value={input}
		class="self-bottom w-full rounded-lg p-4"
		autofocus
	/>
</form>
