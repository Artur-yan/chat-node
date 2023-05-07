<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	import PricingGrid from '$lib/components/PricingGrid.svelte';

	export let data;

	let currentPlan = data.subscription.plan;
</script>

<PricingGrid {currentPlan} />
