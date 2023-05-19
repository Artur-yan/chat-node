<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';

	const planChange = $page.url.searchParams.get('plan-change');
	
	onMount(async () => {
		if (planChange === 'success') {
			goto('/account/settings/plan');
			$alert = "Plan changed successfully!"

		} else {
			goto('/account/chatbots');
		}
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
