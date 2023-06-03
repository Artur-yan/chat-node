<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';

	onMount(async () => {
		const { trackEvent } = Plausible({
			domain: 'chatnode.ai',
			apiHost: 'https://chatnode.ai/events'
		});
		if ($page.url.searchParams.get('plan-change') === 'test') {
			trackEvent('Upgrade to Paid Test');
			goto('/account/settings/plan');
			$alert = 'Plan changed successfully!';
		}
		if ($page.url.searchParams.get('plan-change') === 'success') {
			trackEvent('Upgrade to Paid');
			goto('/account/settings/plan');
			$alert = 'Plan changed successfully!';
		} else {
			goto('/account/chatbots');
		}
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
