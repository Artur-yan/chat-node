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

	async function fetchAccessToken() {
    try {
      const response = await Carbon.generateAccessToken({
        apiKey: carbonAPIKey,
        customerId: $currentBot.id,
      });

      if (response.status === 200) {
        accessToken = response.data.access_token; 
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }


async function fetchUserData() {

  const url = "https://api.carbon.ai/user_files_v2";

  const payload = {
    pagination: {
      limit: 250,
      offset: 0
    },
    order_by: "created_at",
    order_dir: "desc",
    include_raw_file: true,
    include_parsed_text_file: true,
    include_additional_files: true
  };

  const headers = {
    Authorization: `Bearer ${carbonAPIKey}`,
    "Content-Type": "application/json",
    "customer-id": $currentBot.id
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // HERE
  }
}

async function fetchTotalFileCount() {
  try {
    const response = await Carbon.getUserFiles({
      accessToken: accessToken,
      limit: 1,
      offset: 0
    });

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
		<WebScraping {carbonAPIKey} {accessToken} {totalFileCount}/>
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