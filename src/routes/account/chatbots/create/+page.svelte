<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import AddModelData from '$lib/components/AddModelData.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	const botUsage: number = data.bots.length / data.subscription.max_bot;

	onMount(() => {
		if (botUsage >= 1) {
			goto('/account/chatbots');
		}
	});

	let modelId: string;
	let name: string;
	let settings;
	let messages;

	$: if (settings) {
		messages[0].text = settings.greeting;
	}
	let trainingStatus: string | undefined = undefined;

	// $: if (trainingStatus === 'complete') {
	// 	window.location.href = `/account/chatbots/${modelId}/settings`;
	// }
</script>

<svelte:head>
	<title>Create chatbot | ChatNode</title>
</svelte:head>

<div class="bg-neutral py-1">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-2 items-center">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots">
				&larr;
			</a>
			<h1 class="overflow-x-clip whitespace-nowrap overflow-ellipsis max-w-3xl py-1 px-2">
				New Chatbot
			</h1>
		</div>
	</div>
</div>

<div class="container my-4">
	<div class="grid md:grid-cols-2 gap-4">
		<div>
			<div class="card bg-neutral card-compact">
				<div class="card-body">
					<div class="card-title">Add Data</div>
					<AddModelData
						bind:modelId
						userId={data.user.user.userId}
						sessionId={data.user.session.sessionId}
						subscription={data.subscription}
						bind:trainingStatus
						bind:name
					/>
				</div>
			</div>
		</div>
		<div>
			<div class="h-[calc(100vh_-_16rem)] sticky top-10 border-4 rounded-xl border-neutral">
				<Chat
					{modelId}
					bind:messages
					bind:trainingStatus
					{settings}
					userId={data.user.user.userId}
				/>
			</div>
		</div>
	</div>
</div>
