<script lang="ts">
	export let data;
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<div class="container grid grid-cols-2 gap-10">
	<div>
		<AddModelData
			modelId={data.model.id}
			userId={data.user.user.userId}
			sessionId={data.user.session.sessionId}
			subscription={data.subscription}
		/>
	</div>
	<div>
		<Chat modelId={data.model.id} />
	</div>
</div>
