<script>
	import { goto, invalidate } from '$app/navigation';
	import { PUBLIC_ENVIRONMENT } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';

	onMount(async () => {
		if (
			$page.url.searchParams.get('plan-change') === 'success' &&
			PUBLIC_ENVIRONMENT === 'production'
		) {
			const { trackEvent } = Plausible({
				domain: 'chatnode.ai',
				apiHost: 'https://www.chatnode.ai/events'
			});
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
				case '4':
					trackEvent('Switch to Enterprise+');
					break;
			}
		}
	});
	$alert = 'Plan changed successfully!';
	goto('/account/chatbots', { invalidateAll: true });
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
