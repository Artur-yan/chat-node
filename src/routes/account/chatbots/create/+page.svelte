<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import AddModelData from '$lib/components/AddModelData.svelte';

	export let data;

	let modelId: string
	let name: string
	let settings = {
		greeting: 'What can I help you with?',
		public: false,
		allowedUrls: [],
		supportMessage: 'Hmm, I am not sure',
		systemPrompt:
			'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. Refuse to answer any question not about the text. Never break character. Do NOT say "Based on the given information"',
		userPrompt: ''
	};

	let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		}
	];
	let trainingStatus = 'not started'

</script>

<div class="container pb-20">
	<div class="text-sm breadcrumbs text-secondary pb-6 font-bold">
		<ul>
			<li><a href="/account/chatbots">&larr; Chatbots</a></li>
			<li>Create</li>
		</ul>
	</div>

	<div class="grid md:grid-cols-2 gap-10">
		<div>
			{#if trainingStatus == 'not started'}
				<AddModelData
					bind:modelId
					userId={data.user.user.userId}
					sessionId={data.user.session.sessionId}
					subscription={data.subscription}
					bind:trainingStatus
					bind:name
				/>
			{/if}
			{#if trainingStatus == 'ready'}
				<ModelSettings id={modelId} {name} {settings} />
			{/if}
		</div>
		<div>
			<div class="h-[calc(100vh_-_16rem)] sticky top-10">
				<Chat {modelId} {messages} {trainingStatus} />
			</div>
		</div>
	</div>
</div>
