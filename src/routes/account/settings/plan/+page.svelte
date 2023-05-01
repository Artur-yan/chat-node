<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let plan = data.subscription.plan
	// let user = data.subscription.user_id;

	const updatePlan = async (newPlan: number) => {
		try {
			const res = await fetch('/api/account/plan', {

				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({newPlan})
			});
			const url = await res.json();
			goto(url);

		} catch (err) {
			console.error(err);
		}
	}

	// 	const updatePlan = async () => {
	// 	try {
	// 		const res = await fetch('/api/account/plan', {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({ plan })
	// 		});
	// 		//const url = await res.json();
	// 		//goto(url);
	//
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

// 	function transformPlan(plan, key) {
//     if (plan === 0 && key === 0) {
//       return 'current plan';
//     } else if (plan === key) {
//       return 'cancel';
//     } else {
//       return 'change plan';
//     }
//   }



</script>

<section>

<!--	<form on:submit={updatePlan}>-->
		<div class="container my-10 grid md:grid-cols-3 gap-8">
			<label>
<!--				<input class="peer hidden" type="radio" name="plan" value={0} bind:group={plan} />-->
				<div class="card">
					<h2 class="card-title p-4 bg-cyan-900 rounded-lg">FREE</h2>
					<div class="card-body">
						<ul>
							<li>30 chat responses / month</li>
							<li>Up to 3 Chatbots</li>
							<li>Embed on your website using an iframe or JS plugin</li>
						</ul>
						<div class="card-actions justify-end">
							<button on:click={() => updatePlan(0)} class="btn btn-outline btn-secondary w-full" disabled={plan == 0}>{plan == 0 ? 'Current plan' : 'Change plan'}</button>
						</div>
					</div>
				</div>
			</label>
			<label>
<!--				<input class="peer hidden" type="radio" name="plan" value={1} bind:group={plan} />-->
				<div class="card">
					<h2 class="card-title p-4 bg-primary rounded-lg text-neutral">PLUS</h2>
					<div class="card-body">
						<ul>
							<li>30 chat responses / month</li>
							<li>Up to 3 Chatbots</li>
							<li>Embed on your website using an iframe or JS plugin</li>
						</ul>
						<div class="card-actions justify-end">
							<button on:click={() => updatePlan(1)} class="btn btn-outline btn-secondary w-full" disabled={plan == 1}>{plan == 1 ? 'Current plan' : 'Change plan'}</button>
						</div>
					</div>
				</div>
			</label>
			<label>
<!--				<input class="peer hidden" type="radio" name="plan" value={2} bind:group={plan} />-->
				<div class="card">
					<h2 class="card-title p-4 bg-secondary rounded-lg text-neutral">PRO</h2>
					<div class="card-body">
						<ul>
							<li>30 chat responses / month</li>
							<li>Up to 3 Chatbots</li>
							<li>Embed on your website using an iframe or JS plugin</li>
						</ul>
						<div class="card-actions justify-end">
							<button on:click={() => updatePlan(2)} class="btn btn-outline btn-secondary w-full" disabled={plan == 2}>{plan == 2 ? 'Current Plan' : 'Change plan'}</button>
						</div>
					</div>
				</div>
			</label>
		</div>

<!--		<div class="flex justify-center">-->
<!--			<button type="submit" class="btn btn-primary">Switch Plan</button>-->
<!--		</div>-->
<!--	</form>-->

<!--	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>-->
<!--	<stripe-pricing-table pricing-table-id="prctbl_1MzSTwIdugeFU9JRehtZoIew"-->
<!--	publishable-key="pk_test_51MkXnWIdugeFU9JRWv9bwqxEpOwJuBJFp3RGulXHOKMn50ZcihKupFyYRa4SSAvaPcU1ifl4YoyaATS9abhEFIcH008pXwgCAU">-->
<!--	</stripe-pricing-table>-->

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

	.card .btn[disabled]{
		@apply btn-secondary opacity-75;
	}
</style>
