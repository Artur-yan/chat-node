<script lang="ts">
	import { currentBot } from '$lib/stores';

  export let title: string;
  export let value: string;
  export let disabled = false
</script>

<label class="pl-[7px] pr-0 btn join-item btn-outline btn-neutral aria-checked:bg-primary flex flex-wrap justify-start" class:btn-disabled={disabled}>
  <input
      class="radio radio-sm radio-primary"
      type="radio"
      value={value}
      bind:group={$currentBot.settings.gptVersion}
      {disabled}
  />
    {title}
</label>