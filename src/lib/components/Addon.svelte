<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let subscription;
	export let user_id;
	export let plan;
	export let addonId;
	export let name;
	export let description;
	export let price;
	export let bundleQty = 1;
	export let max1 = false;

	const isOnAgentPlan = plan && plan === 1006;

	let qty = 0;
	let qtyToAdd = 1;
	let modifying = false;
	let loadingStripe = false;

	if (subscription) {
		qty = qtyToAdd = subscription.quantity;
	}

	const handleCheckout = async (qty: number) => {
		loadingStripe = true;
		try {
			const res = await fetch(PUBLIC_CHAT_API_URL + '/api/update-addon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id,
					adds_on: addonId,
					qty
				})
			});

			const json = await res.json();
			goto(json.url);
			loadingStripe = false;
		} catch (err) {
			console.error(err);
			loadingStripe = false;
		}
	};

	const handleIncrement = () => {
		if(!max1) {
			qtyToAdd++;
		}
	};

	let unit = 'each';

	if (bundleQty != 1 && !max1) {
		unit = 'per ' + bundleQty.toLocaleString();
	} else if (max1) {
		unit = '';
	}
</script>

<div class="card bg-slate-700 p-0">
	<div class="card-body p-6">
		<h2 class="card-title gap-3">
			<span>{name}</span>

			{#if qty}
				<div class="badge bg-gray-700 badge-lg p-2 border-1 border-gray-500">Installed</div>
			{/if}
		</h2>
		<span class="badge p-3 bg-indigo-600 border-1 border-indigo-700">
			${price}/mo. {unit}
		</span>
		<p class="text-gray-400 italic">{description}</p>
		{#if qty}
			<div class="mt-3 items-center flex gap-2 justify-start flex-wrap">
				{#if subscription.cancel_at}
					<div class="badge badge-warning">Expiring {subscription.cancel_at.toLocaleString()}</div>
				{/if}
				{#if name === 'Custom Domain'}
					<div class="badge badge-lg bg-gray-700 border-1 border-gray-500 p-2">
						<nav class="flex" aria-label="Breadcrumb">
							<ol role="list" class="flex items-center space-x-4">
								<li>
									<div>
										<span class="ml-1 text-xs font-medium text-gray-400 hover:text-gray-700">Dashboard</span>
									</div>
								</li>
								<li>
									<div class="flex items-center">
										<svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
										</svg>
										<span class="ml-1 text-xs font-medium text-gray-400 hover:text-gray-700">Chatbot</span>
									</div>
								</li>
								<li>
									<div class="flex items-center">
										<svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
										</svg>
										<span class="ml-1 text-xs font-medium text-gray-400 hover:text-gray-700" aria-current="page">Share</span>
									</div>
								</li>
							</ol>
						</nav>
					</div>
				{:else}
					<div class="flex flex-wrap gap-2">
						<div class="badge badge-lg bg-gray-700 border-1 border-gray-500 p-2">{qty} x {bundleQty > 1 ? bundleQty.toLocaleString() : ''}</div>
						<div class="badge badge-lg bg-gray-700  border-1 border-gray-500 p-2">${qty * price}/mo.</div>
					</div>
				{/if}
			</div>
		{/if}

		<div class="card-actions mt-10 items-center m-3">
			<button
				class="btn bg-indigo-600 -m-4 border-2 border-indigo-600 font-bold  bg-gradient-to-r from-indigo-200 to-indigo-500 text-transparent bg-clip-text"
				on:click={() => {
					if (max1 && !qty) {
						handleCheckout(1);
					} else {
						modifying = !modifying;
					}
				}}
				class:hidden={modifying}
			>
				{qty ? 'Modify' : 'Purchase'} Addon
			</button>
			{#if modifying}
				<div class="flex join">
					<div class="flex join-item items-center border border-indigo-600">
						<button
							class="btn btn-ghost btn-square text-error"
							on:click={() => qtyToAdd--}
							disabled={qtyToAdd === 1}
							aria-label="Remove Bot"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"
								/>
							</svg>
						</button>
						<div class="badge bg-indigo-600 badge-lg mx-2">
							{(qtyToAdd * bundleQty).toLocaleString()}
						</div>
						<button
							class="btn btn-ghost btn-square text-success"
							on:click={() => handleIncrement()}
							aria-label="Add {name}"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
								/>
							</svg>
						</button>
					</div>
				</div>
				<button
				class="btn btn-indigo-600 mt-2"
				on:click={() => handleCheckout(qtyToAdd)}
				disabled={qty === qtyToAdd || loadingStripe}
				>
					{#if loadingStripe}
						<span class="loading loading-spinner" />
					{:else}
						Confirm 							
					{/if}
				</button>
				{#if qty && !subscription?.cancel_at}
					<button
						class="btn bg-red-400 text-red-700 btn-outline border-none mt-1.5"
						on:click={() => handleCheckout(0)}
						disabled={addonId === 10005 && isOnAgentPlan}
					>
						Remove
					</button>
				{/if}
			{/if}
		</div>
	</div>
</div>
