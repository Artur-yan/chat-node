<script lang="ts">
	import Icon from '@iconify/svelte';

	export let trainingMessage: string;
	export let visible = false;
	export let isTraining = true;
</script>

<div class:hidden={!visible} class="toast toast-start items-center gap-2">
	<div class="alert alert-info">
		{#if isTraining}
			<Icon icon="line-md:uploading-loop" width="24" />
		{:else}
			<Icon icon="line-md:confirm-circle-twotone" width="24" />
		{/if}
		{trainingMessage}
	</div>
</div>
