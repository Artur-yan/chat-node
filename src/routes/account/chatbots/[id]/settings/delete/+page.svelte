<script lang="ts">
	import { currentBot } from '$lib/stores.js';

	import { deleteModel } from '$lib/models.js';

	import { state, alert } from '$lib/stores.js';

	import { goto } from '$app/navigation';

	const handleDelete = async () => {
		$state = 'deletingModel';
		try {
			await deleteModel($currentBot.id);
		} catch (err) {
			$alert = { type: 'error', msg: err };
			$state = 'error';
			return;
		}
		$state = 'modelDeleted';
		$alert = { type: 'success', msg: 'Chatbot deleted' };
		goto('/account/chatbots', {invalidateAll: true});
	};
</script>

<div class="alert alert-error text-lg">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M2.725 21q-.275 0-.5-.138t-.35-.362q-.125-.225-.138-.488t.138-.512l9.25-16q.15-.25.388-.375T12 3q.25 0 .488.125t.387.375l9.25 16q.15.25.138.513t-.138.487q-.125.225-.35.363t-.5.137H2.725ZM12 18q.425 0 .713-.288T13 17q0-.425-.288-.713T12 16q-.425 0-.713.288T11 17q0 .425.288.713T12 18Zm0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.713T12 10q-.425 0-.713.288T11 11v3q0 .425.288.713T12 15Z"
		/></svg
	>
	This action is permanent. By deleting this chatbot, you will lose all of its data including data you've
	trained it on, settings, and all chat history. Proceed with caution.

	<label for="my-modal" class="btn mx-auto"
		><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
			><path
				fill="currentColor"
				d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
			/></svg
		> Delete permanaently</label
	>
</div>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Last chance, are you sure?</h3>
		<div class="modal-action">
			<label for="my-modal" class="btn">Cancel</label>
			<button class="btn btn-error" type="button" on:click={handleDelete}>
				<span class={$state == 'deletingModel' ? 'loading' : 'invisible'} />
				Delete permanaently</button
			>
		</div>
	</div>
</div>
