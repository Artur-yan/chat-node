<script lang="ts">
	export let data
	import AddModelData from "$lib/components/AddModelData.svelte";
</script>

<div class="container">

	<AddModelData modelId={data.model.id} userId={data.user.user.userId} sessionId={data.user.session.sessionId} subscription={data.subscription} />
</div>