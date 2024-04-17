<script lang="ts">
	import type { SuggestedQuestion } from '$lib/models';
  export let suggestedQuestions: SuggestedQuestion[] = [];
  export let settings: any;
  export let askSuggestedQuestion: (value: string, label: string) => void;
  export let isThinking: boolean;
</script>

<div class="relative">
  {#if !settings.suggestedQuestionsStacked}
    <div class="absolute right-[-1rem] top-0 bottom-0 w-12 z-1" style="background: linear-gradient(90deg, {settings.theme.bg}00, var(--bg) 96%);" />
  {/if}
  <div class="flex gap-1 {settings.suggestedQuestionsStacked ? 'flex-wrap' : 'overflow-x-auto'} mb-2 w-full mx-1.5">
    {#each suggestedQuestions as question, i}
      <button
        on:click={() => {
          askSuggestedQuestion(question.value, question.label);
          if(settings.suggestedQuestionsDisappear && !isThinking) {
            const newSuggestedQuestions = suggestedQuestions.filter((_, index) => index !== i);
            suggestedQuestions = newSuggestedQuestions;
          }
        }}
        class="btn btn-sm text-xs rounded-md normal-case bg-[var(--userBubbleBG)] text-[var(--userBubbleText)] border-[var(--inputBorder)] hover:bg-[var(--botBubbleBG)] hover:text-[var(--botBubbleText)]"
        type="button"
      >
        {question.label}
      </button>
    {/each}
  </div>
</div>