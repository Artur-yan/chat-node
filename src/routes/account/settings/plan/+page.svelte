<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';

	export let data;

	let currentPlan = data.subscription.plan;
</script>

<svelte:head>
	<title>Account Plan | ChatNode</title>
</svelte:head>

<div class="container">
	<PricingGrid {currentPlan} />
</div>
