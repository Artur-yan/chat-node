<script lang="ts">
  export let title: string;
  export let value: string;
  export let currentBot;
</script>

<label class="btn join-item btn-outline btn-neutral aria-checked:bg-primary flex justify-start">
  <input
      class="radio radio-sm radio-primary"
      type="radio"
      value={value}
      bind:group={$currentBot.settings.gptVersion}
  />
  {title}
</label>