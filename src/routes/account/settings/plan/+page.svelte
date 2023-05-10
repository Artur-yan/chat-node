<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';

	export let data;

	let currentPlan = data.subscription.plan;
</script>

<div class="container">
	<PricingGrid {currentPlan} />
</div>
