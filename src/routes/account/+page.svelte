<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_ENVIRONMENT, PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';

	onMount(async () => {
		if (
			$page.url.searchParams.get('plan-change')
		) {
			const planChange = $page.url.searchParams.get('plan-change')
			const { trackEvent } = Plausible({
				domain: PUBLIC_PLAUSIBLE_DOMAIN,
				apiHost: PUBLIC_PLAUSIBLE_API_HOST
			});
			switch (planChange) {
				case 'convert':
					trackEvent('Convert to Paid');
					break;
				case 'upgrade':
					trackEvent('Upgrade');
					break;
				case 'downgrade':
					trackEvent('Downgrade');
					break;
				case 'cancel':
					trackEvent('Cancel');
					break;
			}
		}
		$alert = 'Plan changed successfully!';
		goto('/account/chatbots', { invalidateAll: true });
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
