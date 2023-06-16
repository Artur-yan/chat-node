<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';

	onMount(async () => {
		const { trackEvent } = Plausible({
			domain: 'chatnode.ai',
			apiHost: 'https://www.chatnode.ai/events'
		});
		if ($page.url.searchParams.get('plan-change') === 'success') {
			trackEvent('Upgrade to Paid');

			switch ($page.url.searchParams.get('plan')) {
				case '0':
					trackEvent('Switch to Free');
					break;
				case '1':
					trackEvent('Switch to Basic');
					break;
				case '2':
					trackEvent('Switch to Pro');
					break;
				case '3':
					trackEvent('Switch to Enterprise');
					break;
			}

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
