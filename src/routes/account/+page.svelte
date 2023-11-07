<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';
	import Plausible from 'plausible-tracker';
	import { v4 as uuidv4 } from 'uuid';

	export let data;

	let planChange = $page.url.searchParams.get('plan-change');
	let newPlan = $page.url.searchParams.get('new-plan');
	let oldPlan = $page.url.searchParams.get('old-plan');
	let amountSpent = 0;
	let newPlanName = '';

	function gtmTrackPurchase(eventName) {
		dataLayer.push({ ecommerce: null });
		dataLayer.push({
			event: eventName,
			ecommerce: {
				transaction_id: uuidv4(),
				value: amountSpent,
				currency: 'USD',
				items: [
					{
						item_id: newPlan,
						item_name: newPlanName,
						price: amountSpent,
						quantity: 1
					}
				]
			}
		});
	}

	const email = data.user.user.email;

	onMount(async () => {
		switch (newPlan) {
			case '1':
				newPlanName = 'Basic';
				amountSpent = 19;
				break;
			case '2':
				newPlanName = 'Pro';
				amountSpent = 49;
				break;
			case '3':
				newPlanName = 'Enterprise';
				amountSpent = 99;
				break;
			case '4':
				newPlanName = 'Enterprise Plus';
				amountSpent = 399;
				break;
			case '101':
				newPlanName = 'Basic - Annual';
				amountSpent = 190;
				break;
			case '102':
				newPlanName = 'Pro - Annual';
				amountSpent = 490;
				break;
			case '103':
				newPlanName = 'Enterprise - Annual';
				amountSpent = 990;
				break;
			case '104':
				newPlanName = 'Enterprise Plus - Annual';
				amountSpent = 3990;
				break;
		}

		if (planChange) {
			const { trackEvent } = Plausible({
				domain: PUBLIC_PLAUSIBLE_DOMAIN,
				apiHost: PUBLIC_PLAUSIBLE_API_HOST
			});

			switch (planChange) {
				case 'convert':
					trackEvent('Convert to Paid');
					gtmTrackPurchase('Convert');
					break;
				case 'upgrade':
					trackEvent('Upgrade');
					gtmTrackPurchase('Upgrade');
					break;
				case 'downgrade':
					trackEvent('Downgrade');
					gtmTrackPurchase('Downgrade');
					break;
				case 'cancel':
					trackEvent('Cancel');
					dataLayer.push({
						event: 'Cancel'
					});
					break;
			}
			$alert = 'Plan changed successfully!';
		}
		// else if ( $page.url.searchParams.get('signup') === 'success' ) {
		// 	fbq('track', 'StartTrial', {value: '0.00', currency: 'USD', predicted_ltv: '0.00'});
		// }
		goto('/account/chatbots', { invalidateAll: true });
	});
</script>

<svelte:head>
	<title>Account | ChatNode</title>
</svelte:head>
