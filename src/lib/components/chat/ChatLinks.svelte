<script lang="ts">
  import { fade } from "svelte/transition";

  export let settings: any;
  export let links: string[] = [];

  console.log("ChatLinks", links);
</script>

<div in:fade={{delay: 1200}} class="mx-11 mt-6">
  <div class="grid grid-flow-col auto-cols-min grid-rows-2 gap-2 overflow-x-auto py-2 text-base font-semibold leading-7">
    {#each links as link}
      <a href={link} 
         target="_blank" 
         class="inline-flex max-w-[250px] items-center gap-x-1.5 rounded-lg px-2 py-1 text-xs font-medium" 
         style="background-color: {settings.theme.botBubbleBG}"
      >
        <svg class="h-1.5 w-1.5 shrink-0 animate-pulse" fill="{settings.theme.botBubbleText}" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx="3" cy="3" r="3" />
        </svg>
        <p class="truncate" style="color: {settings.theme.botBubbleText}">
          {link.split("://")[1]}</p>
      </a>
    {/each}
  </div>
</div>