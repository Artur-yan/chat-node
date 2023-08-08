<script lang="ts">
	import { currentBot } from '$lib/stores.js';

	export let data;

</script>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Collect User Info</h2>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer flex justify-start gap-4 self-start">
				<input
					type="checkbox"
					class="toggle toggle-warning input-success"
					bind:checked={$currentBot.settings.collectUserEmail}
				/>
				<span class="label-text">Collect Email?</span>
			</label>
		</div>

	</div>
</div>