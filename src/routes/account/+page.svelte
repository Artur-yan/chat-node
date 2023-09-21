<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';
	import fbEvent from '$lib/fb';

	export let data;

	let email  = data.user.user.email;

	onMount(async () => {
		if ( $page.url.search.includes('plan-change') ) {
			const planChange = $page.url.searchParams.get('plan-change')
			const newPlan = $page.url.searchParams.get('new-plan')
			let amountSpent = 0

			switch (newPlan) {
				case '1': amountSpent = 19; break;
				case '2': amountSpent = 49; break;
				case '3': amountSpent = 99; break;
				case '4': amountSpent = 399; break;
				case '101': amountSpent = 190; break;
				case '102': amountSpent = 490; break;
				case '103': amountSpent = 990; break;
				case '104': amountSpent = 3990; break;
			}

			const { trackEvent } = Plausible({	
				domain: PUBLIC_PLAUSIBLE_DOMAIN,
				apiHost: PUBLIC_PLAUSIBLE_API_HOST
			});
			switch (planChange) {
				case 'convert':
					trackEvent('Convert to Paid');
					fbEvent('Purchase', [email], amountSpent);
					break;
				case 'upgrade':
					trackEvent('Upgrade');
					fbEvent('Purchase', [email], amountSpent);
					break;
				case 'downgrade':
					trackEvent('Downgrade');
					fbEvent('Downgrade', [email]);
					break;
				case 'cancel':
					trackEvent('Cancel');
					fbEvent('Downgrade', [email]);
					break;
			}

			$alert = 'Plan changed successfully!';
		} else if ( $page.url.searchParams.get('signup') === 'success' ) {
			fbq('track', 'StartTrial', {value: '0.00', currency: 'USD', predicted_ltv: '0.00'});
		}
		goto('/account/chatbots', { invalidateAll: true });
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
