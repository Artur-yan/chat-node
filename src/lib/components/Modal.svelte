<script lang="ts">
	export let open = false

    let dialog: HTMLDialogElement;

    $: if (dialog && open) dialog.showModal();
</script>

<!-- <div class="fixed inset-0 z-50 items-center justify-center flex bg-neutral/50" class:hidden={!openSub} on:click|self={() => openSub = false} on:keydown={() => openSub = false}>
    <div class="modal-box">
        <slot />
    </div>
</div> -->

<!-- svelte-ignore a11y-click-events-have-key-events -->  
<dialog
	bind:this={dialog}
	on:close={() => (open = false)}
	on:click|self={() => dialog.close()}
    class="modal-box"
>
    <button on:click={() => dialog.close()}>X</button>
	<div on:click|stopPropagation>
		<slot />
	</div>
</dialog>

<style lang="postcss">
	dialog::backdrop {
		@apply bg-slate-950/50
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
