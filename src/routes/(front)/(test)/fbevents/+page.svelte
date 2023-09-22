<script>
	import { onMount } from "svelte";

    onMount(() => {
		fbq('track', 'PageView');
    })
</script>

<svelte:head>
    <script>
		fbq('track', 'PageView');
    </script>
</svelte:head>


<button on:click={() => fbq('track', 'AddToCart')}>Add to cart</button>