<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteModel } from '$lib/models';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let data;

	let deleteModalOpen = false
	let embedModalOpen = false
	let settingsModalOpen = false;

	let modalData
	let iframeEmbedCode

	let selectedModels

	$: console.log(selectedModels)

	const openDeleteModal = (data: Object) => {
		deleteModalOpen = true;
		modalData = data;
	};
	const openEmbedModal = (data: Object) => {
		embedModalOpen = true;
		modalData = data;
		iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${modalData.id}" width="100%" height="100%" style="border: none;"></iframe>`;
	};

</script>

<div class="container">
	<div class="flex justify-between my-4 items-center">
		<div>
			<h1 class="text-2xl mb-2">Chatbots</h1>
		</div>
		<a href="/account/chatbots/create" class="btn btn-primary"> + Create new chatbot </a>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#if data.bots.length > 0}
			{#each data.bots as bot}
				<label>
					<input type="radio" class="peer hidden" bind:group={selectedModels} value={bot.id} />
					<div class="bot-{bot.id} card shadow-xl bg-neutral peer-checked:ring-2">
						<div class="card-body">
							<h2 class="card-title">
								<a href="chatbots/{bot.id}" class="text-primary">{bot.name}</a>
							</h2>
							<p class="flex justify-between">
								created <span class="badge badge-secondary badge-outline"
									>{bot.created.toLocaleString('en-us')}</span
								>
							</p>
							<p class="flex justify-between">
								type <span class="badge badge-secondary">{bot.data_source_type}</span>
							</p>
							<p class="flex justify-between">
								id <span class="badge badge-outline">{bot.id}</span>
							</p>

							<div class="card-actions justify-between items-center mt-10">
								<a class="btn btn-outline btn-sm btn-primary" href="chatbots/{bot.id}">
									<Icon icon="mdi:chat-outline" class="mr-2" width="20" /> Chat
								</a>
								<div class="btn-group bg-base-100 rounded-lg">
									<div class="tooltip tooltip-error" data-tip="Delete">
									<button
										class="btn btn-ghost"
										on:click={() => openDeleteModal({ id: bot.id, name: bot.name })}
									>
										<Icon icon="mdi:delete-outline" width="18" />
									</button>
									</div>
									<div class="tooltip tooltip-info" data-tip="Get embed code">
									<button
										class="btn btn-ghost"
										on:click={() => openEmbedModal({ id: bot.id, name: bot.name })}
									>
										<Icon icon="mdi:code" width="18" />
									</button>
									</div>
									<div class="tooltip tooltip-secondary" data-tip="Edit settings">
										<button
											class="btn btn-ghost"
											on:click={() => settingsModalOpen = true}
										>
											<Icon icon="mdi:settings" width="18" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</label>
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
		<h3 class="font-bold text-lg">Are you sure you want to delete?</h3>
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
		<h3 class="font-bold text-lg">Copy code to embed {modalData}</h3>
		<div class="mockup-code w-full">
			<pre><code>{iframeEmbedCode}</code></pre>
		</div>
		<div class="modal-action">
			<button class="btn btn-secondary" on:click={() => (embedModalOpen = false)}>Done</button>
		</div>
	</div>
</div>

<!-- {#if settingsModalOpen}
	<div class="modal" class:modal-open={settingsModalOpen}>
		<div class="modal-box">
			<h3 class="font-bold text-lg">Settings for {modalData.id}</h3>
			<ModelSettings id={modalData.id} name={modalData.name} settings={modalData.settings} />
		</div>
	</div>
{/if} -->

<!-- <Modal open={settingsModalOpen}>
	Hi!
	<ModelSettings id={modalData.id} name={modalData.name} settings={modalData.settings} />
</Modal> -->