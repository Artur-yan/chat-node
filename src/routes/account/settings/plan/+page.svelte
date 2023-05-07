<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { goto } from '$app/navigation';

	export let data;

	let plan = data.subscription.plan;

	const updatePlan = async (newPlan: number) => {
		const res = await fetch('/api/account/plan', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newPlan)
		});
		const data = await res.json();
		if (data.url) {
			goto(data.url);
		} else if (data.status == 'success') {
			plan = newPlan;
			$alert = 'Plan updated successfully';
		}
	};
</script>

<section>
	<div class="container my-10 grid md:grid-cols-3 gap-8">
		<label>
			<div class="card">
				<h2 class="card-title p-4 bg-cyan-900 rounded-lg">FREE</h2>
				<div class="card-body">
					<ul>
						<li>30 chat responses / month</li>
						<li>Up to 3 Chatbots</li>
						<li>Embed on your website using an iframe or JS plugin</li>
					</ul>
					<div class="card-actions justify-end">
						<button
							on:click={() => updatePlan(0)}
							class="btn btn-outline btn-secondary w-full"
							disabled={plan == 0}>{plan == 0 ? 'Current plan' : 'Change plan'}</button
						>
					</div>
				</div>
			</div>
		</label>
		<label>
			<div class="card">
				<h2 class="card-title p-4 bg-primary rounded-lg text-neutral">PLUS</h2>
				<div class="card-body">
					<ul>
						<li>30 chat responses / month</li>
						<li>Up to 3 Chatbots</li>
						<li>Embed on your website using an iframe or JS plugin</li>
					</ul>
					<div class="card-actions justify-end">
						<button
							on:click={() => updatePlan(1)}
							class="btn btn-outline btn-secondary w-full"
							disabled={plan == 1}>{plan == 1 ? 'Current plan' : 'Change plan'}</button
						>
					</div>
				</div>
			</div>
		</label>
		<label>
			<div class="card">
				<h2 class="card-title p-4 bg-secondary rounded-lg text-neutral">PRO</h2>
				<div class="card-body">
					<ul>
						<li>30 chat responses / month</li>
						<li>Up to 3 Chatbots</li>
						<li>Embed on your website using an iframe or JS plugin</li>
					</ul>
					<div class="card-actions justify-end">
						<button
							on:click={() => updatePlan(2)}
							class="btn btn-outline btn-secondary w-full"
							disabled={plan == 2}>{plan == 2 ? 'Current Plan' : 'Change plan'}</button
						>
					</div>
				</div>
			</div>
		</label>
	</div>
</section>

<style lang="postcss">
	.card {
		@apply card-compact bg-neutral shadow-xl;
	}

	input:checked + .card .btn {
		@apply btn-primary;
	}

	ul {
		@apply divide-y divide-base-100 py-4;
	}

	li {
		@apply py-3;
	}

	.card .btn[disabled] {
		@apply btn-secondary opacity-75;
	}
</style>
