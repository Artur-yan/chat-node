<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { trackPageView } from '$lib/tracking';
  import { PUBLIC_PLAUSIBLE_DOMAIN } from "$env/static/public";
  onMount(() => {
    trackPageView();
    
    const unsubscribe = page.subscribe(() => {
          trackPageView();
        });
    return unsubscribe;
  });
</script>

<svelte:head>
  {@html `<script src="/stats/js/script.js" data-api="/stats/api/event" data-domain="${PUBLIC_PLAUSIBLE_DOMAIN}"></script>`}
</svelte:head>
