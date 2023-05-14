<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		goto('/account/chatbots');
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
