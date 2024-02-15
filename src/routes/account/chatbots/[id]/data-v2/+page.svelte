<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import AddModelDataV2 from '$lib/components/AddModelDataV2.svelte';
	import { alert, currentBot } from '$lib/stores.js';
	import Accordian from '$lib/components/Accordian.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import WebScraping from '$lib/components/data/WebScraping.svelte';
	import Files from '$lib/components/data/Files.svelte';
	import Text from '$lib/components/data/Text.svelte';

	export let data;

  const carbonAPIKey = 'dc14fce440672b41417705d036cf5181d8df1b849c58c6e2c56e3dac1df66366';
	let accessToken: string | undefined;
	let status = '';

	let url: string | undefined;
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
        apiKey: carbonAPIKey,
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

<svelte:head>
	<title>Data v2 | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-3 lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div class="grid grid-cols-3 gap-8 my-4">
		<WebScraping {carbonAPIKey} {accessToken}/>
		<Files {carbonAPIKey} {accessToken}/>
		<Text {carbonAPIKey} {accessToken}/>
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		<iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0"></iframe>
		</div>
	</div>
</div>

<style lang="postcss">
	tr[data-training-status='trained'] .training-status {
		@apply hidden;
	}
	tr[data-training-status='training'] .training-status {
		@apply badge-primary;
	}
	tr:is([data-training-status='training'], [data-training-status='scraping']) .training-status {
		@apply animate-pulse;
	}
	tr[data-training-status='failed'] .training-status {
		@apply !badge-error;
	}
</style>
