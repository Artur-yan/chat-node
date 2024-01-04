<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
	<title>{data.model.name} | ChatNode</title>
</svelte:head>

<div class="flex flex-col flex-1 overflow-hidden rounded-lg m-2 md:m-8">
	<Chat
		modelId={data.model.id}
		trainingStatus={data.model.status}
		settings={data.model.settings}
		avatar={data.model?.avatar_img}
		userId={data.user}
	/>
</div>

<div>
	<style>
		#toggle-btn-befbfc87e25911db {
			visibility: hidden;
		}

		#chat-popup-tooltip {
			visibility: hidden;
		}

		#arrow, #arrow::before {
			visibility: hidden;
			opacity: 0;
		}
	</style>
</div>
