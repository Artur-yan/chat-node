<script lang="ts">
    import { goto } from '$app/navigation'
    import { PUBLIC_CHAT_API_URL } from '$env/static/public'

    export let subscription
    export let user_id
    export let addonId
    export let name
    export let description
    export let price
    export let bundleQty = 1



    let qty = 0
    let qtyToAdd = 1
    let modifying = false
    let loadingStripe = false

    console.log(subscription)

    if (subscription) {
        qty = qtyToAdd = subscription.quantity
    }

    	const handleCheckout = async (qty: number) => {
        // console.log(user_id, addonId, qty)
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
			goto(json.url)
			loadingStripe = false;
		} catch (err) {
			console.error(err);
			loadingStripe = false;
		}
	};

</script>

<div class="card bg-neutral">
    <div class="card-body">
        <h2 class="card-title gap-4">
            <span>{name}</span>
            <span class="badge">${price}/mo. {bundleQty !== 1 ? '/ ' + bundleQty.toLocaleString() : 'each'}</span>
        </h2>
        <p>{description}</p>
        {#if qty}
            <div class="mt-4 items-center flex gap-4 justify-start flex-wrap">
                <div class="badge badge-success badge-lg">Installed</div>
                {#if subscription.cancel_at}
                    <div class="badge badge-warning ">Expiring {subscription.cancel_at.toLocaleString()}</div>
                {/if}
                <div class="badge badge-lg">{qty}x </div>
                <div class="badge badge-lg">${qty * price}/mo.</div>
            </div>
            {/if}
            
            <div class="card-actions mt-10 items-center">
                <button class="btn btn-primary btn-outline" on:click={() => modifying = !modifying} class:hidden={modifying}>{qty ? 'Modify' : 'Purchase'} Addon</button>
                {#if modifying}
                <div class="flex join">
                    <div class="flex join-item items-center border border-primary">
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
                        <div class="badge badge-primary badge-lg mx-2">{(qtyToAdd * bundleQty).toLocaleString()}</div>
                        <button class="btn btn-ghost btn-square text-success" on:click={() => qtyToAdd++} aria-label="Add Bot">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                                <path
                                    fill="currentColor"
                                    d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"
                                />
                            </svg>
                        </button>
                        <button
                            class="join-item btn btn-primary"
                            on:click={() => handleCheckout(qtyToAdd)}
                            disabled={qty === qtyToAdd || loadingStripe}
                        >
                        {#if loadingStripe}
                            <span class="loading loading-spinner" />
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 11l4-7m10 7l-4-7M2 11h20M3.5 11l1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4M9 11l1 9m-5.5-4.5h15M15 11l-1 9"/></svg>
                        {/if}

                        </button>
                    </div>
                </div>
                {#if subscription?.cancel_at}
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