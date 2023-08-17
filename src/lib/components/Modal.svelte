<script lang="ts">
	export let id: string;
	export let title: string;
</script>

<dialog {id} class="modal">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg mb-8">{title}</h3>
		<slot />
		<div class="modal-action">
			<slot name="actions" />
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
