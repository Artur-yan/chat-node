<script lang="ts">
	export let id: string;
	export let title: string;
	export let maxWidth = '32rem';
	export let hookClose = () => {};
	export let closeOnOutsideClick = true;
</script>

<dialog {id} class="modal">
	<form method="dialog" class="modal-box" style="max-width: {maxWidth};">
		<h3 class="font-bold text-lg mb-8">{title}</h3>
		<slot />
		<div class="modal-action">
			<slot name="actions" />
		</div>
	</form>
	{#if closeOnOutsideClick}
		<form method="dialog" class="modal-backdrop">
			<button on:click={hookClose}>close</button>
		</form>
	{/if}
</dialog>
