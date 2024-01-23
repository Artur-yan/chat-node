<script lang="ts">
  import { PUBLIC_SITE_URL } from "$env/static/public";
</script>


<svelte:head>
  {@html `<script  src="/stats/js/script.js" data-api="/stats/api/event" data-domain="${PUBLIC_SITE_URL}"></script>`}
</svelte:head>


