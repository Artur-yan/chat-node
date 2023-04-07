<script>
	export let input = '';
	export let autofocus = true
	export let disabled = false
</script>

<form on:submit|preventDefault>
	<input
		type="text"
		placeholder="type your message"
		bind:value={input}
		class="self-bottom w-full rounded-lg p-4 text-black"
		{autofocus}
		{disabled}
	/>
</form>
