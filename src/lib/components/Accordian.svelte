<script lang="ts">
	export let open = false;
</script>

<div class="border border-primary/50 bg-base-300 rounded-xl hover:shadow-xl hover:bg-base-200 transition-all" class:open>
	<button
		on:click={() => (open = !open)}
		type="button"
		class="flex text-lg justify-between text-left items-center w-full p-5 font-bold"
	>
		<slot name="title" />
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class:rotate-180={open}
			class="transition-transform"
			><path
				fill="currentColor"
				d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"
			/></svg
		>
	</button>
	<div class="body grid transition-all duration-500 opacity-0" aria-hidden>
		<div class="overflow-hidden">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	.body{
		grid-template-rows: 0fr;
	}
	.open .body {
		@apply p-4 opacity-100;
		grid-template-rows: 1fr;
	}
</style>
