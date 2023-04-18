<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteModel } from '$lib/models';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let deleteModalOpen = false;
	let embedModalOpen = false;

	let modalData = {
		id: '',
		name: ''
	};

	let iframeEmbedCode = '';

	$: iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${modalData.id}" width="100%" height="100%" style="border: none;"></iframe>`;

	const openDeleteModal = (data: Object) => {
		deleteModalOpen = true;
		modalData = data;
	};
	const openEmbedModal = (data: Object) => {
		embedModalOpen = true;
		modalData = data;
	};
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
				<div class="bot-{bot.id} card shadow-xl bg-neutral">
					<div class="card-body">
						<h2 class="card-title">
							{bot.name}
						</h2>
						<p>
							created <span class="badge badge-secondary"
								>{bot.created.toLocaleString('en-us')}</span
							>
						</p>
						<p>
							type <span class="badge badge-secondary">{bot.data_source_type}</span>
						</p>
						<p>
							id <span class="badge badge-outline">{bot.id}</span>
						</p>

						<div class="card-actions justify-end mt-10">
							<div class="btn-group">
								<a class="btn btn-primary" href="chatbots/{bot.id}">
									<Icon icon="mdi:chat-outline" class="mr-2" width="20" /> Chat
								</a>
								<button
									class="btn btn-primary"
									on:click={() => openDeleteModal({ id: bot.id, name: bot.name })}
								>
									<Icon icon="mdi:delete-outline" width="18" />
								</button>
								<button
									class="btn btn-primary"
									on:click={() => openEmbedModal({ id: bot.id, name: bot.name })}
								>
									<Icon icon="mdi:code" width="18" />
								</button>
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

<div class="modal" class:modal-open={deleteModalOpen}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to delete {modalData.name}</h3>
		<div class="modal-action">
			<button class="btn btn-secondary" on:click={() => (deleteModalOpen = false)}>cancel</button>
			<button
				class="btn btn-error"
				on:click={() => {
					deleteModel(modalData.id);
					deleteModalOpen = false;
					document.querySelector(`.bot-${modalData.id}`).remove();
				}}>Delete</button
			>
		</div>
	</div>
</div>
<div class="modal" class:modal-open={embedModalOpen}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Copy code to embed {modalData.name}</h3>
		<div class="mockup-code w-full">
			<pre><code>{iframeEmbedCode}</code></pre>
		</div>
		<div class="modal-action">
			<button class="btn btn-secondary" on:click={() => (embedModalOpen = false)}>Done</button>
		</div>
	</div>
</div>
