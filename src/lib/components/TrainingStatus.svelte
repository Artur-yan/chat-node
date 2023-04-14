<script lang="ts">
	import Icon from '@iconify/svelte';

	export let trainingMessage: string;
	export let visible = false;
	export let training = true;
</script>

<section
	class:hidden={!visible}
	class="fixed left-[20px] bottom-[20px] border-2 rounded shadow-lg p-2 pr-4 text-primary-900 bg-primary-300 border-primary-900 text-sm flex items-center gap-2 h-12"
>
	{#if training}
		<Icon icon="line-md:uploading-loop" width="24" />
	{:else}
		<Icon icon="line-md:confirm-circle-twotone" width="24" />
	{/if}
	<p>{trainingMessage}</p>
</section>
