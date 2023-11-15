<script lang="ts">
    import { currentBot } from '$lib/stores.js'
	let newDomain: string
    let busyAddingCustomDomain = false
    let error: Object | undefined
    let parsedURL: Object
    let busyRemovingCustomDomain = false

    if($currentBot.custom_domain) { 
        parsedURL = parseURL($currentBot.custom_domain)
    }

    function parseURL(url: string) {
        const urlSplit = url.split('.')
        let parsedURL = {
            apexDomain: '',
            subdomain: '',
        }

        if (urlSplit.length < 3) {
            parsedURL.apexDomain = url
            parsedURL.subdomain = 'www'
        } else {
            if(urlSplit[0] == 'www') parsedURL.apexDomain = urlSplit.slice(-2).join('.')
            parsedURL.subdomain = urlSplit.slice(0, -2).join('.')
        }

        return parsedURL
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
        } else {
            $currentBot.custom_domain = newDomain
            parsedURL = parseURL($currentBot.custom_domain)
        }

        busyAddingCustomDomain = false
	}

    async function removeVercelCustomDomain() {

        busyRemovingCustomDomain = true

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
        newDomain = ''
        busyRemovingCustomDomain = false
	}

    // async function getDomainConfig() {
    //     let res = await fetch('/api/vercel/custom-domain/configuration', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             domain: $currentBot.custom_domain
    //         })
    //     });

    //     console.log(await res.json())
    // }
</script>

	<div class="card bg-neutral mb-12">
		<div class="card-body grid md:grid-cols-[3fr_2fr] gap-12 items-stretch">
			<div>
                <h2 class="card-title mb-4">
                        Custom Domain <span class="badge badge-accent">NEW Upgraded System</span>
                </h2>
                {#if $currentBot.custom_domain}
                    <div class="border rounded-xl p-4 border-base-100">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl text-white">{$currentBot.custom_domain}</h2>
                            <!-- <button class="btn btn-outline" on:click={getDomainConfig}>Update</button> -->
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
                                <tr>
                                    <th>CNAME</th>
                                    <td>{parsedURL.subdomain}</td>
                                    <td>cname.vercel-dns.com.</td>
                                </tr>
                                {#if parsedURL.apexDomain}
                                    <tr>
                                        <th>A</th>
                                        <td>{parsedURL.subdomain}</td>
                                        <td>76.76.21.21</td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                        <div class="text-right">
                            <button class="btn btn-error btn-outline btn-sm mt-4" disabled={busyRemovingCustomDomain} on:click={removeVercelCustomDomain}>
                                {#if busyRemovingCustomDomain}
                                    <span class="loading loading-spinner loading-xs text-error" />
                                {/if}
                                Remove
                            </button>
                        </div>
                    </div>
                {:else}
                    <form on:submit|preventDefault={addVercelCustomDomain}>
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
                                    class="btn btn-primary join-item"
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
                {/if}
            </div>

            <div class="p-6 rounded-lg flex items-center -m-8 justify-center">
                <div>
                    <h3 class="text-lg font-bold mb-4 text-accent">What's new:</h3>
                    <ul class="text-white">
                        <li>Faster loading</li>
                        <li>0 mentions of ChatNode in the source code</li>
                        <li>Add apex domains (not just sub-domains)</li>
                        <li>Faster SSL Generation</li>
                        <li>Domain Verification</li>
                    </ul>
                </div>
            </div>
		</div>
	</div>
