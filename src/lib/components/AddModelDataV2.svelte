<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { fade } from 'svelte/transition';
  import * as Carbon from 'carbon-connect-js';
	import { onMount } from 'svelte';

	export let modelId: string = '';
	export let userId: string;
	export let plan: number;

	let activeTab = 0;
	let busyFetchingUrls = false;
	let url: string | undefined;


	const fetchUrlsToScrape = async () => {
    
	};

	const cancelFetchUrlsToScrape = () => {

	};

  onMount(async () => {
    console.log('userId', userId);
    const accessTokenResponse = await Carbon.generateAccessToken(
      'dc14fce440672b41417705d036cf5181d8df1b849c58c6e2c56e3dac1df66366',
      userId,
    );

    console.log(accessTokenResponse);
    console.log(accessTokenResponse.data.access_token);
  });

</script>

<div>
	<div class="grid grid-cols-3 gap-2 mb-4">
		<!-- <label class="btn" class:btn-outline={activeTab == 1}>
			<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
			+ File
		</label>
		<label class="btn" class:btn-outline={activeTab == 2}>
			<input type="radio" name="tab" bind:group={activeTab} value={2} class="hidden peer" />
			+ Text
		</label> -->
		<label class="btn" class:btn-outline={activeTab == 3}>
			<input type="radio" name="tab" bind:group={activeTab} value={3} class="hidden peer" />
			+ URL
		</label>
	</div>

	{#if activeTab == 3}
  <!-- URL -->
		<form on:submit|preventDefault={() => fetchUrlsToScrape()}>
			<div class="form-control">
				<div class="join">
					<input
						type="text"
						class="input input-bordered w-full join-item placeholder:text-sm"
						bind:value={url}
						placeholder="e.g. https://chatnode.ai https://chatnode.ai/sitemap.xml"
						required
						autofocus
					/>
					<button class="btn btn-primary join-item" type="submit" disabled={busyFetchingUrls}>
						<span class={busyFetchingUrls ? 'loading loading-xs' : 'hidden'} />
						Scrape URLs
					</button>
				</div>
			</div>
		</form>

    <br><br><br>
    <!-- Sitemap -->
    <form on:submit|preventDefault={() => fetchUrlsToScrape()}>
			<div class="form-control">
				<div class="join">
					<input
						type="text"
						class="input input-bordered w-full join-item placeholder:text-sm"
						bind:value={url}
						placeholder="e.g. https://chatnode.ai https://chatnode.ai/sitemap.xml"
						required
						autofocus
					/>
					<button class="btn btn-primary join-item" type="submit" disabled={busyFetchingUrls}>
						<span class={busyFetchingUrls ? 'loading loading-xs' : 'hidden'} />
						Scrape Sitemap
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>