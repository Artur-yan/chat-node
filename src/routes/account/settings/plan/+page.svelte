<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	
	export let data;

	let billingTerm = 'monthly';

	onMount(() => {
		invalidate('/account/settings/plan');
	});

	let currentPlan = data.subscription.plan;

	if(currentPlan > 100) {
		billingTerm = 'yearly';
	}
</script>

<svelte:head>
	<title>Account Plan | ChatNode</title>
</svelte:head>

<div class="container mb-20">
	<PricingGrid {currentPlan} {billingTerm} />
</div>
