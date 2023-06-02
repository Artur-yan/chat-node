<script>
	import { alert } from '$lib/stores.js';
	import { fly } from 'svelte/transition';

	$: if ($alert) {
		setTimeout(() => ($alert = ''), 3000);
	}
</script>

{#if $alert}
	<div
		class="toast toast-top toast-center transition-all"
		class:visible={$alert}
		in:fly={{ y: -80, duration: 350 }}
		out:fly={{ y: -80, duration: 350 }}
	>
		<div class="alert alert-success">
			<div class="w-72 max-w-full flex items-center justify-between">
				<span>{$alert}</span>
				<button on:click={() => ($alert = '')} class="p-2"
					><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41L14.59 8Z"
						/></svg
					></button
				>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.toast.visible {
		/* @apply !translate-y-2; */
	}
</style>
