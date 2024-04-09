<script lang="ts">
  export let settings: any;
  export let resetChat: () => void;
</script>

<header style="background-color: var(--headerBG);" class="flex justify-between px-5 py-5 items-center gap-3 shadow-md shadow-[var(--headerShadow)]">
  <div class="flex gap-3">
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
  </div>

  <!-- Reset Button -->
  <button 
    class="z-[1] btn btn-circle btn-sm btn-ghost flex items-center justify-center rotatable"
    style="color: var(--resetButton);"
    title="Reset Chat"
    on:click={resetChat}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"
      />
    </svg>
  </button>
</header>