<script lang="ts">
  import { currentBot } from '$lib/stores.js';
  import { fade } from 'svelte/transition';
</script>

{#each Object.entries($currentBot.settings.systemPrompts) as prompt}
  <div class="flex items-center gap-3 mx-2 my-4" transition:fade={{duration: 1000}}>
    <h2 class="text-lg">{prompt[0]}</h2>
  <button
    class="btn btn-xs btn-secondary p-0.5"
    on:click={() => {
      delete $currentBot.settings.systemPrompts[prompt[0]];
      $currentBot.settings.systemPrompts = { ...$currentBot.settings.systemPrompts };
    }}
  >
    Delete
  </button>
  </div>
  <textarea
  bind:value={$currentBot.settings.systemPrompts[prompt[0]]}
  on:input={() => console.log($currentBot.settings.systemPrompts)}
  class="textarea w-full leading-normal"
  name="prompt"
  rows="10"
/>
{/each}