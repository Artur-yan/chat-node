<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { json } from '@sveltejs/kit';

	export let data;


	const addons = (data.subscription?.addons);

	console.log(addons);

	let messagesToAdd = 0;
	let messages = 0
	let botsToAdd = 0;
	let bots = 0;
	let addBranding = 0;
	let branding = 0;
	let tokensToAdd = 0;
	let tokens = 0;

	console.log(addons);

	if (addons) {
		messagesToAdd = messages = addons['10001']?.quantity || 0;
		botsToAdd = bots = addons['10002']?.quantity || 0;
		tokensToAdd = tokens = addons['10003']?.quantity || 0;
		addBranding = branding = addons['10004']?.quantity || 0;
	}

	const handleCheckout = async (addon: number, qty: number) => {
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
		} catch (err) {
			console.error(err);
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
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title gap-4">
					<span>Bots</span>
					<span class="badge">$5/mo. each</span>
				</h2>
				<p>Add individual bots to your plan allowance.</p>
				{#if bots !== 0}
					<p class="badge badge-success badge-lg">Installed</p>
				{/if}
				<div class="flex mt-10 items-center gap-2">
					<div class="flex gap-1 flex-1 items-center">
						<button
							class="btn btn-ghost btn-circle text-error"
							on:click={() => botsToAdd--}
							disabled={botsToAdd === 0}
							aria-label="Remove Bot"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"
								/>
							</svg>
						</button>
						<div>{botsToAdd}</div>
						<button class="btn btn-ghost btn-circle text-primary" on:click={() => botsToAdd++} disabled={data.subscription?.plan === 0} aria-label="Add Bot">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
								/>
							</svg>
						</button>
					</div>
						<button
							class="btn btn-primary btn-outline"
							on:click={() => handleCheckout(10002, botsToAdd)}
							disabled={botsToAdd === bots}
						>
							{bots > 0 ? "Modify" : 'Purchase'} <span class="badge badge-sm" class:hidden={botsToAdd === 0}>
								${botsToAdd * 7}
							</span>
						</button>
				</div>
	
				<div class="card-actions justify-end" />
			</div>
		</div>
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title gap-4">
					<span>Messages</span>
					<span class="badge">$8/mo. per {Number(1000).toLocaleString()}</span>
				</h2>
				<p>Add messages to your plan usable by any of your bots.</p>
				{#if messages !== 0}
					<p class="badge badge-success badge-lg">Installed</p>
				{/if}
				<div class="flex mt-10 items-center gap-2">
					<div class="flex gap-1 flex-1 items-center">
						<button
							class="btn btn-ghost btn-circle text-error"
							on:click={() => (messagesToAdd--)}
							disabled={messagesToAdd === 0}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"
								/>
							</svg>
						</button>
						<div>{(messagesToAdd * 1000).toLocaleString()}</div>
						<button
							class="btn btn-ghost btn-circle text-primary"
							on:click={() => (messagesToAdd++)}
							disabled={data.subscription?.plan === 0}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
								/>
							</svg>
						</button>
					</div>
					<button
						class="btn btn-primary btn-outline"
						on:click={() => handleCheckout(10001, messagesToAdd)}
						disabled={messagesToAdd === 0}
					>
						Purchase <span class="badge badge-sm" class:opacity-20={messagesToAdd === 0}>
							${messagesToAdd * 7}
						</span>
					</button>
				</div>
	
				<div class="card-actions justify-end" />
			</div>
		</div>
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title gap-4">
					<span>Tokens</span>
					<span class="badge">$8/mo. per {Number(250000).toLocaleString()}</span>
				</h2>
				<p>Add additional tokens to your bots to train on larger data sets.</p>
				{#if tokens !== 0}
					<p class="badge badge-success badge-lg">Installed</p>
				{/if}
				<div class="flex mt-10 items-center gap-2">
					<div class="flex gap-1 flex-1 items-center">
						<button
							class="btn btn-ghost btn-circle text-error"
							on:click={() => (tokensToAdd--)}
							disabled={tokensToAdd === 0}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"
								/>
							</svg>
						</button>
						<div>{(tokensToAdd * 250000).toLocaleString()}</div>
						<button
							class="btn btn-ghost btn-circle text-primary"
							on:click={() => (tokensToAdd++)}
							disabled={data.subscription?.plan === 0}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
								<path
									fill="currentColor"
									d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
								/>
							</svg>
						</button>
					</div>
					<button
						class="btn btn-primary btn-outline"
						on:click={() => handleCheckout(10003, tokensToAdd)}
						disabled={tokensToAdd === 0}
					>
						Purchase <span class="badge badge-sm" class:opacity-20={tokensToAdd === 0}>
							${tokensToAdd * 8}
						</span>
					</button>
				</div>
	
				<div class="card-actions justify-end" />
			</div>
		</div>
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title gap-4">
					<span>No Branding</span>
					<span class="badge">$14/mo.</span>
				</h2>
				<p>Remove the ChatNode branding from all of your bots.</p>
				{#if branding}
					<p class="badge badge-success badge-lg">Installed</p>
				{/if}

				<div class="flex mt-10 items-center gap-2 justify-end">
					{#if !branding}
						<button class="btn btn-primary btn-outline" disabled={data.subscription?.plan === 0} on:click={() => handleCheckout(10004, 1)}>
							Purchase
						</button>
					{:else}
							<button class="btn btn-error btn-xs btn-outline" on:click={() => handleCheckout(10004, 0)}>
								Remove
							</button>
					{/if}
				</div>
	
				<div class="card-actions justify-end" />
			</div>
		</div>
	</div>
</div>
