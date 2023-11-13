<script lang="ts">
    import { alert } from '$lib/stores'
    import { currentBot } from '$lib/stores.js'
	let newDomain
    let busyAddingCustomDomain = false
    let error

    function parseURL(url: string) {
        try {
            return new URL(url)
        } catch (err) {
            return false
        }
    }

    async function addVercelCustomDomain() {
        error = undefined
        busyAddingCustomDomain = true

        let res = await fetch('/api/vercel/custom-domain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: newDomain,
                botId: $currentBot.id
            })
        });

        res = await res.json()

        if(res.error){
            error = res.error
        }
        
        busyAddingCustomDomain = false   

	}
    async function removeVercelCustomDomain() {

        let res = await fetch('/api/vercel/custom-domain', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: $currentBot.custom_domain,
                botId: $currentBot.id
            })
        });

        res = await res.json()

        if(res.error){
            error = res.error
        }

        $currentBot.custom_domain = undefined
        
	}

    async function getDomainConfig() {
        let res = await fetch('/api/vercel/custom-domain/configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: $currentBot.custom_domain
            })
        });

        console.log(await res.json())

    }
</script>

<div>
	<div class="card bg-neutral mb-12">
		<div class="card-body">
			<h2 class="card-title">
				<div>
					Custom Domain <span class="badge badge-accent">NEW Upgraded System</span>
				</div>
			</h2>
            {#if $currentBot.custom_domain}
                <div class="border rounded-xl p-4 border-base-100">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-light">{$currentBot.custom_domain}</h2>
                        <button class="btn btn-outline" on:click={getDomainConfig}>Update</button>
                    </div>
                    <table class="table bg-base-100 rounded overflow-hidden">

                        <!-- head -->
                        <thead class="bg-base-300">
                            <tr>
                                <th>Type</th>
                                <th>Host</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- row 1 -->
                            <tr>
                                <th>CNAME</th>
                                <td>{$currentBot.custom_domain.split('.')[0]}</td>
                                <td>cname.vercel-dns.com.</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-error btn-outline btn-sm mt-4" on:click={removeVercelCustomDomain}>Remove</button>

                </div>

            {:else}
                <div>
                    <form on:submit|preventDefault={addVercelCustomDomain} class="mb-8">
                        <div class="form-control">
                            <label class="label" for="domain">
                                <span class="label-text">Add Domain Name</span>
                            </label>
                            <div class="join">
                                <input
                                    type="text"
                                    class="input join-item w-full"
                                    name="domain"
                                    bind:value={newDomain}
                                />
                                <button
                                    type="submit"
                                    class="btn btn-success join-item"
                                    disabled={busyAddingCustomDomain}
                                >
                                    {#if busyAddingCustomDomain}
                                        <span class="loading loading-spinner text-primary mr-2 loading-sm" />
                                    {/if}
                                    {busyAddingCustomDomain ? 'Adding' : 'Add'}
                                </button>
                            </div>
                            {#if error}
                                <label class="label">
                                    <span class="label-text-alt text-error">{error.message}</span>
                                </label>
                            {/if}
                        </div>
                    </form>
                </div>
            {/if}
		</div>
	</div>
</div>
