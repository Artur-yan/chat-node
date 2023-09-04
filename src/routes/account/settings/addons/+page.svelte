<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import Addon from '$lib/components/Addon.svelte';
	import { json } from '@sveltejs/kit';

	export let data;


	const addons = (data.subscription?.addons);

	console.log(addons);

	let messagesToAdd = 1;
	let messages = 0
	let botsToAdd = 1;
	let bots = 0;
	let tokensToAdd = 1;
	let tokens = 0;
	let addBranding = 1;
	let branding = 0;

	let modifyMessages = false
	let modifyBots = false
	let modifyTokens = false
	let modifyBranding = false

	let loadingStripe = false;

	if (addons) {
		if (addons['10001']?.quantity) {
			messagesToAdd = messages = addons['10001']?.quantity;
		}
		if (addons['10002']?.quantity) {
			botsToAdd = bots = addons['10002']?.quantity;
		}
		if (addons['10003']?.quantity) {
			tokensToAdd = tokens = addons['10003']?.quantity;
		}
		if (addons['10004']?.quantity) {
			addBranding = branding = addons['10004']?.quantity;
		}
	}

	const handleCheckout = async (addon: number, qty: number) => {
		loadingStripe = true;
		try {
			const res = await fetch(PUBLIC_CHAT_API_URL + '/api/update-addon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: data.subscription?.user_id,
					adds_on: addon,
					qty
				})
			});

			const json = await res.json();
			goto(json.url)
			loadingStripe = false;
		} catch (err) {
			console.error(err);
			loadingStripe = false;
		}
	};
</script>

<div class="container my-10">
	{#if data.subscription?.plan === 0}
		<div class="alert mb-8 text-warning justify-between flex">
			<p>You must have an active subscription to purchase addons.</p>
			<a href="subscription" class="btn btn-warning">Upgrade</a>
		</div>
	{/if}
	
	<div class="grid md:grid-cols-2 gap-8">
		<!-- <div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title gap-4">
					<span>Bots</span>
					<span class="badge">$5/mo. each</span>
				</h2>
				<p>Add individual bots to your plan allowance.</p>
				{#if bots}
					<div class="mt-4 items-center flex gap-4 justify-start flex-wrap">
						<div class="badge badge-success badge-lg">Installed</div>
						{#if data.subscription?.addons['10002'].cancel_at}
							<div class="badge badge-warning ">Expiring {data.subscription?.addons['10002'].cancel_at.toLocaleString()}</div>
						{/if}
						<div class="badge badge-lg">{bots}x </div>
						<div class="badge badge-lg">${bots * 5}/mo.</div>
					</div>
					{/if}
					
					<div class="card-actions mt-10 items-center">
						<button class="btn btn-primary btn-outline" on:click={() => modifyBots = !modifyBots} class:hidden={modifyBots}>{bots ? 'Modify' : 'Purchase'} Addon</button>
						{#if modifyBots}
						<div class="flex join">
							<div class="flex join-item items-center border border-primary">
								<button
									class="btn btn-ghost btn-square text-error"
									on:click={() => botsToAdd--}
									disabled={botsToAdd === 1}
									aria-label="Remove Bot"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
										<path
											fill="currentColor"
											d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"
										/>
									</svg>
								</button>
								<div class="badge badge-primary badge-lg mx-2">{botsToAdd}</div>
								<button class="btn btn-ghost btn-square text-success" on:click={() => botsToAdd++} aria-label="Add Bot">
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
							class="join-item btn btn-primary"
							on:click={() => handleCheckout(10002, botsToAdd)}
							disabled={bots === botsToAdd || loadingStripe}
						>
						{#if loadingStripe}
							<span class="loading loading-spinner" />
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 11l4-7m10 7l-4-7M2 11h20M3.5 11l1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4M9 11l1 9m-5.5-4.5h15M15 11l-1 9"/></svg>
						{/if}
	
						</button>
						{#if !addons['10002'].cancel_at}
						<button
							class="btn btn-error btn-xs btn-outline border-none"
							on:click={() => handleCheckout(10002, 0)}
						>
						Remove
						</button>
						{/if}
						{/if}
					</div>
				</div>
		</div> -->
		<Addon name="Bots" description="Add individual bots to your plan allowance." price={5} subscription={data.subscription?.addons['10001']} addonId="10001" user_id={data.subscription?.user_id} />

		<Addon name="Messages" description="Add messages to your plan usable by any of your bots." price={8} bundleQty={1000} subscription={data.subscription?.addons['10002']} addonId="10002" user_id={data.subscription?.user_id} />


		<Addon name="Tokens" description="Add additional tokens to your bots to train on larger data sets." price={8} bundleQty={25000} subscription={data.subscription?.addons['10003']} addonId="10003" user_id={data.subscription?.user_id} />

		<Addon name="No Branding" description="Remove the ChatNode branding from all of your bots." price={15} subscription={data.subscription?.addons['10004']} addonId="10004" user_id={data.subscription?.user_id} />

	</div>
</div>
