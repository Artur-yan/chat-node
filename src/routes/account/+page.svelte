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

	const email = data.user.user.email;


	onMount(async () => {
		switch (newPlan) {
		case '1':
			amountSpent = 19;
			break;
		case '2':
			amountSpent = 49;
			break;
		case '3':
			amountSpent = 99;
			break;
		case '4':
			amountSpent = 399;
			break;
		case '101':
			amountSpent = 190;
			break;
		case '102':
			amountSpent = 490;
			break;
		case '103':
			amountSpent = 990;
			break;
		case '104':
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
					dataLayer.push({ ecommerce: null });
					dataLayer.push({
						event: 'Convert',
						ecommerce: {
							currency: 'USD',
							value: amountSpent,
							purchase: {
								actionField: {
									'id': uuidv4(),
									'revenue': amountSpent,
								},
								products: [{
									'id': newPlan,
									'price': amountSpent,
									'quantity': 1
								}]
							}
						}
					});
					break;
				case 'upgrade':
					trackEvent('Upgrade');
					dataLayer.push({
						event: 'Upgrade',
						ecommerce: {
							currency: 'USD',
							value: amountSpent
						}
					})
					break;
				case 'downgrade':
					trackEvent('Downgrade');
					dataLayer.push({
						event: 'Downgrade',
						ecommerce: {
							currency: 'USD',
							value: amountSpent
						}
					})
					break;
				case 'cancel':
					trackEvent('Cancel');
					dataLayer.push({
						event: 'cancel'
					})
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
