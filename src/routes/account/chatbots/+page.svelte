<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteModel } from '$lib/models';

	export let data;

	console.log(data);
</script>

<div class="container">
	<div class="flex justify-between my-4 items-center">
		<div>
			<h1 class="text-sm">Account</h1>
			<h2 class="text-2xl mb-2">Chatbots</h2>
		</div>
		<a href="/account/chatbots/create" class="btn btn-primary"> + Create new chatbot </a>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#if data.bots.length > 0}
			{#each data.bots as bot}
				<!-- <section
					class="rounded border border-primary-700 hover:no-underline text-secondary-400 hover:bg-primary-900/50"
				>
					<div class="flex justify-between">
						<h3 class="p-4">{bot.name ? bot.name : 'Unnamed' }</h3>

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

				</section> -->
				<div class="card shadow-xl bg-neutral">
					<div class="card-body">
						<h2 class="card-title">
							{bot.name}
						</h2>
						<p>created: {bot.created.toLocaleString('en-us')}</p>
						<div class="card-actions">
							<div class="badge badge-primary">type: {bot.data_source_type}</div>
							<div class="badge badge-outline">id: {bot.id}</div>
						</div>
						<div class="card-actions justify-end mt-10">
							<div class="btn-group">
								<a class="btn btn-primary" href="chatbots/{bot.id}">
									<Icon icon="mdi:chat-outline" class="mr-2" width="20" /> Chat
								</a>
								<button class="btn btn-primary">
									<Icon icon="mdi:delete-outline" width="18" />
								</button>
								<label for="modalDeleteModel" class="btn btn-primary">
									<Icon icon="mdi:code" width="18" />
								</label>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div>
				You haven't created any chatbots yet. <a href="/account/chatbots/create">Create one now.</a>
			</div>
		{/if}
	</div>
</div>

<input type="checkbox" id="modalDeleteModel" class="modal-toggle" />
<label for="modalDeleteModel" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">Are you sure you want to delete?</h3>
    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
  </label>
</label>