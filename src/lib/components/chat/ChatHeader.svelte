<script lang="ts">
  export let settings: any;
</script>

<header style="background-color: var(--headerBG);" class="flex px-6 py-4 items-center gap-3 shadow-md shadow-[var(--headerShadow)]">
  <h1 class="font-bold text-lg" style="color: var(--headerTitle)">
    {settings.publicTitle ? settings.publicTitle : ''}
  </h1>
  {#if settings.statusEnabled}
  <span class="inline-flex items-center gap-x-1.5 rounded-md text-sm font-medium text-[--statusColor]">
    <svg class="h-1.5 w-1.5 fill-[--statusColor]" viewBox="0 0 6 6" aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
    {settings.theme.statusMessage}
  </span>
  {/if}
</header>