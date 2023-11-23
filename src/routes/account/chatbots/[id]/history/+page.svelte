<script lang="ts">
	import { Remarkable } from 'remarkable';
	import tiersMap from '$lib/data/tiers';
	import '$lib/assets/css/chat.postcss';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	let busyExporting = false;
	import { alert } from '$lib/stores';

	export let data;

	const md = new Remarkable();

	let chatHistory = data.chats;
	let visibleChatConversation;
	let currentChatClass: string;
	let busyGettingChatConversation = false;

	const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	const getChatConversation = async (chat: Object) => {
		busyGettingChatConversation = true;
		const res = await fetch(`/api/chat-history/${chat.session_id}`, {
			method: 'GET'
		});
		const data = await res.json();


		visibleChatConversation = chat;

		visibleChatConversation.messages = data;
		document.querySelector(`.${currentChatClass}`)?.classList.remove('active');
		
		currentChatClass = 'chat-' + chat.session_id; // chat- prefix necessary for classes that start with numbers

		busyGettingChatConversation = false;
		document.querySelector(`.${currentChatClass}`)?.classList.add('active');
		document.querySelector(`.${currentChatClass} .read-indicator`)?.remove();
	};
	

	const getChatExport = async (format: 'json' | 'csv') => {
		busyExporting = true;
		const today = new Date();
		const startDate = new Date(new Date().setDate(new Date().getDate() - tiersMap[data.subscription?.plan].history_length_days));
		const endDate = new Date(new Date().setDate(new Date().getDate() + 1));

		function formatDateForAPI(date: Date) {
			return date.toISOString().split('T')[0]
		}

		const params =
			'start_date=' + formatDateForAPI(startDate)
			+ '&end_date=' + formatDateForAPI(endDate)
			+ '&bot_id=' + data.model.id
			+ '&user_id=' + data.session.user.userId
			+ '&session_id=' + data.session.sessionId
			+ '&file_format=' + format
		
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/download-chat-history-with-leads?${params}`);

		const json = await res.json();

		if (json.error) {
			$alert = {type: 'warning', msg: json.error};
			busyExporting = false;
			return;
		}

		fetch(json.url).then(function(t) {
			return t.blob().then((b)=>{
				var a = document.createElement("a");
				a.href = URL.createObjectURL(b);
				a.setAttribute("download", `chat-history--${data.model.id}.csv`);
				a.click();
			}
			);
		});

		busyExporting = false;
	};

	const reverseSort = () => {
		chatHistory = chatHistory.reverse();
		const match = document.querySelector(`.${currentChatClass}`);
		match?.classList.add('active');
	};

	const formatDate = (date: Date) => {
		return date.toLocaleString([], {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<div class="container md:grid md:grid-cols-[320px_auto] gap-4 min-h-0 h-full flex-1 basis-0 my-4">
	<div class="h-full flex flex-col flex-1 overflow-hidden">
		<div class="flex items-center justify-between p-2 pl-4 border-b border-neutral bg-neutral rounded-t-lg">
			<h3 class="font-bold text-xs">Conversations</h3>
			<label for="sort" class="hidden">By Date</label>
			<select class="select select-bordered select-xs" name="sort" on:change={reverseSort}>
				<option>Newest First</option>
				<option>Oldest First</option>
			</select>
		</div>
		<div class="overflow-y-scroll h-full bg-base-200">
			<ul class="menu divide-y divide-neutral" role="navigation">
				{#if chatHistory.length === 0}
					<li class="menu-title text-base-content">No chat history</li>
				{:else}
					{#each chatHistory as chat}
						<li>
							<button
							type="button"
							class="chat-{chat.session_id} border border-base-200 my-2 w-full flex items-center cursor-pointer"
							on:click={(e) => getChatConversation(chat)}
							>
								{#if !chat.read}
									<div class="read-indicator bg-primary rounded-full w-1 h-1"></div>
								{/if}
								<div>
									{#if chat.enduser_name || chat.enduser_email}
										<div class="text-secondary/70">
											<span>{chat.enduser_name ? chat.enduser_name : ''}</span>
											<span>{chat.enduser_email ? '<' + chat.enduser_email + '>' : ''}</span>
										</div>
									{/if}
									{formatDate(chat.created_at)}
								</div>
							</button>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
		<div class="bg-neutral rounded-b-lg p-2 flex items-center gap-2">
			<h4 class="font-bold text-xs">Export</h4>
			<button class="btn btn-xs btn-outline" on:click={() => getChatExport('csv')} disabled={chatHistory.length === 0}>
				CSV
			</button>
			<button class="btn btn-xs btn-outline" on:click={() => getChatExport('json')} disabled={chatHistory.length === 0}>			
				JSON
			</button>
				{#if busyExporting}
					<div class="loading loading-spinner loading-xs text-primary"></div>
				{/if}	
		</div>
	</div>

	<div class="h-full overflow-y-auto rounded-lg border border-secondary p-4">
		{#if busyGettingChatConversation}
			<div class="flex flex-col justify-center items-center h-full">
				<div class="loading loading-spinner loading-lg text-primary"></div>
			</div>
		{:else if visibleChatConversation}
			<div class="mb-4 flex justify-between gap-2 flex-wrap">
				<div class="flex gap-2 flex-wrap">
					{#each Array(visibleChatConversation.enduser_name, visibleChatConversation.enduser_email, visibleChatConversation.enduser_phone) as info}
						{#if info}
							<span class="badge badge-secondary badge-lg">{info}</span>
						{/if}
					{/each}
				</div>
				<div class="badge badge-neutral badge-lg">
					{formatDate(visibleChatConversation.created_at)}
				</div>
			</div>
			{#each visibleChatConversation.messages as item}
				<div class="chat {item.message.type == 'human' ? 'chat-end' : 'chat-start'}">
					<div class="chat-header">
						<time class="text-xs opacity-50">
							{new Date(item.created_at).toLocaleTimeString()}
						</time>
					</div>
					<div class="chat-bubble">
						<div class="message-body">
							{@html postProcessMsgHTML(md.render(item.message.data.content))}
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="flex flex-col justify-center items-center h-full">
				<p class="text-secondary">Select a chat session to view the conversation</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.active {
		@apply border-secondary border;
	}
</style>
