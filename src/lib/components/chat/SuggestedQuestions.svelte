<script lang="ts">
	import type { SuggestedQuestion } from '$lib/models';
  export let suggestedQuestions: SuggestedQuestion[] = [];
  export let settings: any;
  export let askSuggestedQuestion: (value: string, label: string) => void;

</script>

<div class="relative">
  <div class="absolute right-[-1rem] top-0 bottom-0 w-12 z-1" style="background: linear-gradient(90deg, {settings.theme.bg}00, var(--bg) 96%);" />
  <div class="flex gap-1 overflow-x-auto mb-2 w-full mx-1.5">
    {#each suggestedQuestions as question}
      <button
        class="btn btn-sm text-xs normal-case bg-[var(--inputBG)] text-[var(--inputText)] border-[var(--inputBorder)] hover:bg-[var(--botBubbleBG)] hover:text-[var(--botBubbleText)]"
        type="button"
        on:click={() => askSuggestedQuestion(question.value, question.label)}
      >
        {question.label}
      </button>
    {/each}
  </div>
</div>