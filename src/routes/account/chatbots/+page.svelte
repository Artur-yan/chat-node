<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { deleteModel } from '$lib/models';

	export let data;

	console.log(data)


</script>

<div class="container">
	<div class="flex justify-between my-4 items-center">
		<div>
			<h1 class="text-sm">Account</h1>
			<h2 class="text-2xl mb-2">Chatbots</h2>
		</div>
		<a href="/account/chatbots/create" class="button"> + Create new chatbot </a>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#if data.bots.length > 0}
			{#each data.bots as bot}
				<section
					class="rounded border border-primary-700 hover:no-underline text-secondary-400 hover:bg-primary-900/50"
				>
					<div class="flex justify-between">
						<h3 class="p-4">{bot.name ? bot.name : 'Unnamed' }</h3>
						<div class="hidden actions justify-end items-center">
							<button class="text-white hover:text-red-400 p-4" on:click={() => deleteModel(bot.id)}><Icon icon="mdi:delete-outline" /></button>
						</div>
					</div>
					<a href="chatbots/{bot.id}" class="details block p-4">
						<div>
							<h4>Created on:</h4>
							<p>{bot.created.toLocaleString('en-us')}</p>
						</div>
						<div>
							<h4>Trained with:</h4>
							<p>{bot.data_source_type}</p>
						</div>
						<div>
							<h4>id:</h4>
							<p class="truncate">{bot.id}</p>
						</div>
					</a>

				</section>
			{/each}
		{:else}
				<div>
					You haven't created any chatbots yet. <a href="/account/chatbots/create">Create one now.</a>
				</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	h4 {
		@apply text-primary-600 text-xs mr-2;
	}

	.details div {
		@apply pt-2 pb-6 flex justify-between text-sm;
	}

	.grid p {
	}

	section:hover .actions {
		@apply flex
	}
</style>
