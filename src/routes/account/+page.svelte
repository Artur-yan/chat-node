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
			goto('/account/settings/plan');
			$alert = 'Plan changed successfully!';

			switch ($page.url.searchParams.get('plan')) {
				case '0':
					trackEvent('Switch to Free');
					break;
				case '1':
					$alert = 'Switch to Basic';
					break;
				case '2':
					$alert = 'Switch to Pro';
					break;
				case '3':
					$alert = 'Switch to Enterprise';
					break;
			}

			if ($page.url.searchParams.get('plan-change') === 'success') {
			}

		} else {
			goto('/account/chatbots');
		}
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
