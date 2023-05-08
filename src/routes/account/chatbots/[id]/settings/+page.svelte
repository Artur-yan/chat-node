<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';

	export let data;
</script>

<div class="container">
	<ModelSettings
		id={data.model.id}
		name={data.model.name}
		settings={data.model.settings}
	/>
</div>
