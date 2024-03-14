<script lang="ts">
    import { currentBot } from '$lib/stores.js'
	let newDomain: string
    let busyAddingCustomDomain = false
    let error: Object | undefined
    let parsedURL: Object
    let busyRemovingCustomDomain = false
    let busyCheckingDomainConfig = true
    let customDomainConfig: Object
	import { updateModel } from '$lib/models';
	import { onMount } from 'svelte';

    $: newDomain = newDomain?.toLowerCase()

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

        try {
            const res = await fetch('/api/vercel/custom-domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    domain: newDomain,
                    botId: $currentBot.id
                })
            });        
            const data = await res.json()

            if(data.error){
                error = data.error
            } else {
                $currentBot.custom_domain = newDomain
                parsedURL = parseURL($currentBot.custom_domain)

                if(parsedURL.apexDomain) {
                    await fetch('/api/vercel/custom-domain', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            domain: 'www.' + parsedURL.apexDomain,
                            botId: $currentBot.id
                        })
                    });
                }

                if ($currentBot.settings.customDomain ) {
                    $currentBot.settings.customDomain = '' // Clear Out old domain info
                    await updateModel($currentBot.id, $currentBot.name, $currentBot.settings);
                }
            }
        } catch (err) {
            console.error(err)
        }

        getDomainConfig()

        busyAddingCustomDomain = false
	}

    async function removeVercelCustomDomain() {

        busyRemovingCustomDomain = true

        let parsedURL = parseURL($currentBot.custom_domain)

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

        if(parsedURL.apexDomain) {
            await fetch('/api/vercel/custom-domain', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    domain: 'www.' + parsedURL.apexDomain,
                    botId: $currentBot.id
                })
            });
        }

        res = await res.json()

        if(res.error){
            error = res.error
        }

        $currentBot.custom_domain = undefined
        newDomain = ''
        busyRemovingCustomDomain = false
	}

    async function getDomainConfig() {
        busyCheckingDomainConfig = true
        let res = await fetch('/api/vercel/custom-domain/configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: $currentBot.custom_domain
            })
        });

        customDomainConfig = await res.json()
        console.log('customDomainConfig', customDomainConfig)
        busyCheckingDomainConfig = false

    }

    onMount(async () => {
        if($currentBot.custom_domain) {
            await getDomainConfig()
        }
    })
</script>

	<div class="card bg-neutral mb-12">
		<div class="card-body">
			<div>
                <h2 class="card-title mb-4">
                    Custom Domain
                </h2>
                {#if $currentBot.custom_domain}
                    <div class="border rounded-xl p-4 border-base-100">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex gap-3 items-center">                                
                                <h2 class="md:text-xl text-white">{$currentBot.custom_domain}</h2>

                                <div class="flex items-center">
                                    {#if busyCheckingDomainConfig}
                                        <div class="loading loading-spinner loading-sm text-white" />
                                    {:else if customDomainConfig?.misconfigured || !customDomainConfig?.verified}
                                        <div class="badge text-error gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM64 256c0-106.1 86-192 192-192c42.1 0 81 13.7 112.6 36.7L100.7 368.6C77.7 337 64 298.1 64 256zm192 192c-42.1 0-81-13.7-112.6-36.7l267.9-267.9c23 31.7 36.7 70.5 36.7 112.6c0 106.1-86 192-192 192z"/></svg>
                                            Pending Verification
                                        </div>
                                    {:else}
                                        <svg class="text-success" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012L24 4Z"/><path d="m17 24l5 5l10-10"/></g></svg>
                                    {/if}
                                </div>
                                {#if !busyCheckingDomainConfig && (customDomainConfig?.misconfigured || !customDomainConfig?.verified)}
                                    <button class="btn btn-outline btn-xs" on:click={getDomainConfig}>Refresh</button>
                                {/if}
                            </div>
                            <div>
                                <button class="btn btn-error btn-outline btn-xs" disabled={busyRemovingCustomDomain} on:click={removeVercelCustomDomain}>
                                    {#if busyRemovingCustomDomain}
                                        <span class="loading loading-spinner loading-xs text-error" />
                                    {/if}
                                    Remove
                                </button>
                            </div>
                        </div>
                        
                        {#if !busyCheckingDomainConfig && (customDomainConfig?.misconfigured || !customDomainConfig?.verified)}
                            <h3 class="mb-2">Add DNS Records (After adding, it may take up to 24 hours for the changes to take effect)</h3>
                        {:else }
                            <h3 class="mb-2">DNS Records</h3>
                        {/if}
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
                                    <td>CNAME</td>
                                    <td>{parsedURL.subdomain}</td>
                                    <td>cname.vercel-dns.com.</td>
                                </tr>
                                {#if parsedURL.apexDomain}
                                    <tr>
                                        <td>A</td>
                                        <td>@</td>
                                        <td>76.76.21.21</td>
                                    </tr>
                                {/if}
                                {#if !customDomainConfig?.verified && customDomainConfig?.verification?.length}
                                    {#each customDomainConfig.verification as record}
                                        <tr>
                                            <th>{record.type}</th>
                                            <td>{record.domain}</td>
                                            <td>{record.value}</td>
                                        </tr>
                                    {/each}
                                {/if}
                            </tbody>
                        </table>
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
		</div>
	</div>
