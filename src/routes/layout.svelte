<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { trackPageView } from '$lib/tracking';
  import { PUBLIC_PLAUSIBLE_DOMAIN } from '$env/static/public';}

  onMount(() => {
    trackPageView();

    const unsubscribe = page.subscribe(() => {
      trackPageView();
    });

    return unsubscribe;
  });
</script>