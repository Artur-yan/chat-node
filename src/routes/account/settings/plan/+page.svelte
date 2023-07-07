<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	
	export let data;

	let billingTerm = 'monthly';	
	
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
