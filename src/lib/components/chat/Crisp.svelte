<script lang="ts">
  import { goto } from '$app/navigation';

  export let settings: any;
  
	const transferToCrisp = () => {
		goto('https://go.crisp.chat/chat/embed/?website_id=' + settings.crispWebsiteId);
	};
</script>

<div class="flex gap-1 mb-2 overflow-x-auto w-full mx-1.5">
  <button
  class="btn btn-sm text-xs normal-case bg-[var(--inputBG)] text-[var(--inputText)] border-[var(--inputBorder)] hover:bg-[var(--botBubbleBG)] hover:text-[var(--botBubbleText)]"
  type="button"
  on:click={() => transferToCrisp()}
  >
    {settings.crispButtonText}
  </button>
</div>