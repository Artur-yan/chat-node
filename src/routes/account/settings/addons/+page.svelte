<script lang="ts">
    import { PUBLIC_CHAT_API_URL } from '$env/static/public'



    export let data

    console.log(data)

    const addons = data.subscription.addons;

    let messagesToAdd = addons['10000']?.qty || 0;
    let botsToAdd = addons['10001']?.qty || 0;
    let addBranding = addons['10002']?.qty || 0;
    let tokensToAdd = addons['10003']?.qty || 0;

    [{"id":10001,"qty":1,"stripe_sb":"string"}]


    const handleCheckout = async (addon: number, qty: number) => {
        const res  = await fetch(PUBLIC_CHAT_API_URL + '/api/update-addon', {
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
        console.log (await res.json())
    };
</script>

<div class="container grid md:grid-cols-2 gap-8">
    <div class="card bg-neutral">
        <div class="card-body">
                <h2 class="card-title gap-4">
                    <span>Bots</span>
                    <span class="badge">$5/mo. each</span>
                </h2>
            <p>Add individual bots to your plan allowance.</p>
            <div class="flex mt-10 items-center gap-2">
                <div class="flex gap-1 flex-1 items-center">
                    <button class="btn btn-ghost btn-circle text-error" on:click={() => botsToAdd--} disabled={botsToAdd === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"/></svg>
                    </button>
                    <div>{botsToAdd}</div>
                    <button class="btn btn-ghost btn-circle text-success" on:click={() => botsToAdd++}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"/></svg>
                    </button>
                </div>
                <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10001,botsToAdd)} disabled={botsToAdd === 0}>Purchase <span class="badge badge-sm" class:opacity-20={botsToAdd === 0}>${botsToAdd * 7}</span></button>
            </div>

            <div class="card-actions justify-end">
            </div>
        </div>
    </div>
    <div class="card bg-neutral">
        <div class="card-body">
                <h2 class="card-title gap-4">
                    <span>Messages</span>
                    <span class="badge">$8/mo. per {Number(1000).toLocaleString()}</span>
                </h2>
            <p>Add messages to your plan usable by any of your bots.</p>
            <div class="flex mt-10 items-center gap-2">
                <div class="flex gap-1 flex-1 items-center">
                    <button class="btn btn-ghost btn-circle text-error" on:click={() => messagesToAdd -= 1000} disabled={messagesToAdd === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"/></svg>
                    </button>
                    <div>{messagesToAdd.toLocaleString()}</div>
                    <button class="btn btn-ghost btn-circle text-success" on:click={() => messagesToAdd += 1000}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"/></svg>
                    </button>
                </div>
                <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10000,botsToAdd)} disabled={messagesToAdd === 0}>Purchase <span class="badge badge-sm" class:opacity-20={messagesToAdd === 0}>${messagesToAdd / 1000 * 7}</span></button>
            </div>

            <div class="card-actions justify-end">
            </div>
        </div>
    </div>
    <div class="card bg-neutral">
        <div class="card-body">
                <h2 class="card-title gap-4">
                    <span>Tokens</span>
                    <span class="badge">$8/mo. per {Number(250000).toLocaleString()}</span>
                </h2>
            <p>Add additional tokens to your bots to train on larger data sets.</p>
            <div class="flex mt-10 items-center gap-2">
                <div class="flex gap-1 flex-1 items-center">
                    <button class="btn btn-ghost btn-circle text-error" on:click={() => tokensToAdd -= 250000} disabled={tokensToAdd === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"/></svg>
                    </button>
                    <div>{tokensToAdd.toLocaleString()}</div>
                    <button class="btn btn-ghost btn-circle text-success" on:click={() => tokensToAdd += 250000}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"/></svg>
                    </button>
                </div>
                <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10003,tokensToAdd)} disabled={tokensToAdd === 0}>Purchase <span class="badge badge-sm" class:opacity-20={tokensToAdd === 0}>${tokensToAdd / 250000 * 8}</span></button>
            </div>

            <div class="card-actions justify-end">
            </div>
        </div>
    </div>
    <div class="card bg-neutral">
        <div class="card-body">
                <h2 class="card-title gap-4">
                    <span>No Branding</span>
                    <span class="badge">$14/mo.</span>
                </h2>
            <p>Remove the ChatNode branding from all of your bots.</p>
            <div class="flex mt-10 items-center gap-2 justify-end">
                {#if addBranding === 0}
                    <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10002,1)}>Purchase <span class="badge badge-sm">$14</span></button>
                {:else}
                    <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10002,0)}>Remove</button>
                {/if}
            </div>

            <div class="card-actions justify-end">
            </div>
        </div>
    </div>
</div>