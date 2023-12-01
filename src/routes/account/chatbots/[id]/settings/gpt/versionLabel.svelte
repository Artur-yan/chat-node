<script lang="ts">
  export let title: string;
  export let value: string;
  export let currentBot: any;
  export let disable: boolean; 
</script>

<label class="pl-[7px] pr-0 btn join-item btn-outline btn-neutral aria-checked:bg-primary flex flex-wrap justify-start" class:btn-disabled={disable}>
  <input
      class="radio radio-sm radio-primary"
      type="radio"
      value={value}
      bind:group={$currentBot.settings.gptVersion}
      disabled={disable}
  />
    {title}
</label>