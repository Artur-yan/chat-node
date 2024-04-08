<script lang="ts">
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import { currentBot } from '$lib/stores';
	export let data;

</script>

<svelte:head>
	<title>{data.model.name} | ChatNode</title>
</svelte:head>

<div class="flex flex-col flex-1 overflow-hidden rounded-lg m-2 md:m-8">
	<iframe class="w-full h-[80vh]" src="{PUBLIC_EMBED_URL}/{$currentBot.id}?context=iframe" allow="clipboard-read; clipboard-write" frameborder="0" title=""></iframe>
</div>

<div>
	<style>
		#toggle-btn-befbfc87e25911db {
			visibility: hidden;
		}

		#chatbot-befbfc87e25911db-chat {
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
