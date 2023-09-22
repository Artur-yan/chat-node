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