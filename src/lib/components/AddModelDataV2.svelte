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
  let busyFetchingSitemapUrls = false;
	let url: string | undefined;
  const carbon_api_key = '752f7de712916611f49e01b4b34ac82727f112f17448a4f7e816595ccb47579c';
  let accessToken: string | undefined;
  let sitemap: string | undefined;

  async function initiateScraping() {
    const urlsToScrape = await retrieveUrls() || [];

    console.log('Urls to scrape:', urlsToScrape);
    console.log('Access token:', accessToken);
    try {
      //@ts-ignore
      const response = await Carbon.submitScrapeRequest({
        accessToken: accessToken,
        urls: urlsToScrape,
        recursionDepth: 1,
        maxPagesToScrape: 5000,
      });

      if (response.status === 200) {
        console.log('Scraping result:', response.data.files);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }

  async function retrieveUrls() {
    const params = {
      accessToken: accessToken,
      url: url,
    };

    try {
      const response = await Carbon.fetchUrls(params);

      if (response.status === 200) {
        console.log('Fetched URLs successfully:', response.data.urls);
        return response.data.urls;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error fetching URLs:', err.message);
    }
  }

  async function fetchSitemapUrls() {
    try {
      const response = await Carbon.handleFetchSitemapUrls({
        accessToken: accessToken,
        sitemapUrl: sitemap,
      });

      if (response.status === 200) {
        console.log('Retrieved URLs:', response.data.urls);
        console.log('Total URLs:', response.data.count);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }
  fetchSitemapUrls();

  onMount(async () => {
    async function fetchAccessToken() {
    try {
      const response = await Carbon.generateAccessToken({
        apiKey: 'dc14fce440672b41417705d036cf5181d8df1b849c58c6e2c56e3dac1df66366',
        customerId: userId,
      });

      if (response.status === 200) {
        console.log('Access token:', response.data);
        accessToken = response.data.access_token; 
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  fetchAccessToken();
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
		<form on:submit|preventDefault={() => initiateScraping()}>
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
					<button class="btn btn-primary join-item" type="submit">
						Scrape URLs
					</button>
				</div>
			</div>
		</form>

    <br><br><br>
    <!-- Sitemap -->
    <form on:submit|preventDefault={() => fetchSitemapUrls()}>
			<div class="form-control">
				<div class="join">
					<input
						type="text"
						class="input input-bordered w-full join-item placeholder:text-sm"
						bind:value={sitemap}
						placeholder="e.g. https://chatnode.ai https://chatnode.ai/sitemap.xml"
						required
						autofocus
					/>
					<button class="btn btn-primary join-item" type="submit">
						Scrape Sitemap
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>