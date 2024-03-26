<script lang="ts">
  import { currentBot } from '$lib/stores.js';
</script>

{#each Object.entries($currentBot.settings.systemPrompts) as prompt}
  <div class="flex items-center gap-3 m-4">
    <h2 class="my-3">{prompt[0]}</h2>
  <button
    class="btn btn-xs btn-primary"
    on:click={() => {
      delete $currentBot.settings.systemPrompts[prompt[0]];
      $currentBot.settings.systemPrompts = { ...$currentBot.settings.systemPrompts };
    }}
  >
    Delete
  </button>
  </div>
  <textarea
  bind:value={$currentBot.settings.systemPrompt[prompt[0]]}
  on:input={() => ($currentBot.settings.personalityCustomized = true)}
  class="textarea w-full leading-normal"
  name="prompt"
  rows="10"
/>
{/each}