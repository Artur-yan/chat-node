<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import WebScraping from '$lib/components/data/WebScraping.svelte';
	import Files from '$lib/components/data/Files.svelte';
	import Text from '$lib/components/data/Text.svelte';
	import * as Carbon from 'carbon-connect-js';

	export let data;

  const carbonAPIKey = '752f7de712916611f49e01b4b34ac82727f112f17448a4f7e816595ccb47579c';
	let accessToken: string;
  let totalFileCount:number;

	// async function fetchAccessToken() {
  //   try {
  //     const response = await fetch('/api/data-sources/access-token', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         customerId: $currentBot.id,
  //       }),
  //     });

  //     const data = await response.json();
  //     accessToken = data.access_token;

  //     console.log('Access token:', accessToken);
  //   } catch (err) {
  //     console.error('Unexpected error:', err);
  //   }
  // }

  async function fetchAccessToken() {
    try {
      const response = await Carbon.generateAccessToken({
        apiKey: carbonAPIKey,
        customerId: $currentBot.id,
      });

      if (response.status === 200) {
        accessToken = response.data.access_token; 
        console.log('Access token:', accessToken);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  async function fetchTotalFileCount() {
    try {
      const response = await fetch('/api/data-sources/total-file-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          customerId: $currentBot.id,
        }),
      });

      const data = await response.json();
      totalFileCount = data.count;

      if (response?.status === 200) {
        totalFileCount = response.data?.count || 0;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }

  onMount(async () => {
  	await fetchAccessToken();
    await fetchTotalFileCount();
  });
</script>

<svelte:head>
	<title>Data v2 | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-2 lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div class="grid grid-cols-3 gap-8 my-4">
		<WebScraping {carbonAPIKey} {accessToken}/>
		<Files {accessToken} {totalFileCount}/>
		<Text {accessToken} {totalFileCount}/>
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		  <iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0" title=""></iframe>
		</div>
	</div>
</div>