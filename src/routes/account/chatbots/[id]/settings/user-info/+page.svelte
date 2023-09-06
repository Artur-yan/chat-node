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
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Name?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success"
						bind:checked={$currentBot.settings.collectUserName}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserNameLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserNameLabel"
						placeholder="Name"
						bind:value={$currentBot.settings.collectUserNameLabel}
					/>
				</div>
			</div>
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Email?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success"
						bind:checked={$currentBot.settings.collectUserEmail}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserEmaileLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserEmailLabel"
						placeholder="Email"
						bind:value={$currentBot.settings.collectUserEmailLabel}
					/>
				</div>
			</div>
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Phone?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success"
						bind:checked={$currentBot.settings.collectUserPhone}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserPhoneLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserPhoneLabel"
						placeholder="Phone"
						bind:value={$currentBot.settings.collectUserPhoneLabel}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
