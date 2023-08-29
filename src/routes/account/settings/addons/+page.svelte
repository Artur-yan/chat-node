<script lang="ts">
    import { PUBLIC_CHAT_API_URL } from '$env/static/public'

    let botsToAdd = 0;

    export let data

    console.log(data)

    const handleCheckout = async (addon: number, qty: number) => {
        const res  = await fetch(PUBLIC_CHAT_API_URL + '/api/update-addon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: data.subscription?.user_id,
                addon,
                qty
            })
        });
    };
</script>

<div class="container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div class="card bg-neutral">
        <div class="card-body">
                <h2 class="card-title gap-4">
                    <span>Bots</span>
                    <span class="badge badge-sm">$4/mo.</span>
                </h2>
            <p>Add individual bots to your plan allowance.</p>
            <div class="flex mt-10 items-center gap-2">
                <div class="flex gap-1 flex-1">
                    <button class="btn btn-ghost btn-circle text-error" on:click={() => botsToAdd--} disabled={botsToAdd === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-6 10v2h12v-2H10z"/></svg>
                    </button>
                    <input type="number" class="input w-20" min="0" bind:value={botsToAdd} />
                    <button class="btn btn-ghost btn-circle text-success" on:click={() => botsToAdd++}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3zm0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5zm-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"/></svg>
                    </button>
                </div>
                <div>
                    {#if botsToAdd > 0}
                            ${botsToAdd * 4}
                    {/if}
                </div>
                <button class="btn btn-primary btn-outline" on:click={() => handleCheckout(10002,botsToAdd)} disabled={botsToAdd === 0}>Purchase</button>
            </div>

            <div class="card-actions justify-end">
            </div>
        </div>
    </div>

</div>