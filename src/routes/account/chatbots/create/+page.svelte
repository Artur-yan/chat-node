<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { addModel } from '$lib/models';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import { alert } from '$lib/stores.js';
	import AddModelData from '$lib/components/AddModelData.svelte';

	export let data;

	let modelId = '';
	let name = 'Untitled';
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
		},
		{
			text: 'Once your bot is trained, type a message to test your responses.',
			sender: 'bot'
		}
	];
	let step = 1;
	let trainingStatus: 'training' | 'ready' | 'failed' = 'ready';
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
			{#if step == 1}
				<AddModelData
					{modelId}
					userId={data.user.user.userId}
					sessionId={data.user.session.sessionId}
					subscription={data.subscription}
				/>
			{/if}
			{#if step == 2}
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
