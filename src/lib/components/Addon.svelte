<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let subscription;
	export let user_id;
	export let addonId;
	export let name;
	export let description;
	export let price;
	export let bundleQty = 1;
	export let max1 = false;

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
				<div class="flex flex-wrap gap-2">
					<div class="badge badge-lg bg-gray-700 border-1 border-gray-500 p-2">{qty} x {bundleQty > 1 ? bundleQty.toLocaleString() : ''}</div>
					<div class="badge badge-lg bg-gray-700  border-1 border-gray-500 p-2">${qty * price}/mo.</div>
				</div>
			</div>
		{/if}

		<div class="card-actions mt-10 items-center m-3">
			<button
				class="btn bg-indigo-600 -m-4 border-2 border-indigo-600 font-bold  bg-gradient-to-r from-indigo-200 to-indigo-500 text-transparent bg-clip-text"
				on:click={() => {
					if (max1) {
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
							on:click={() => qtyToAdd++}
							aria-label="Add {name}"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
								/>
							</svg>
						</button>
						<button
							class="join-item btn btn-indigo-600"
							on:click={() => handleCheckout(qtyToAdd)}
							disabled={qty === qtyToAdd || loadingStripe}
						>
							{#if loadingStripe}
								<span class="loading loading-spinner" />
							{:else}
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
							</svg>							
							{/if}
						</button>
					</div>
				</div>
				{#if qty && !subscription?.cancel_at}
					<button
						class="btn btn-error btn-xs btn-outline border-none"
						on:click={() => handleCheckout(0)}
					>
						Remove
					</button>
				{/if}
			{/if}
		</div>
	</div>
</div>
