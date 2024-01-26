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
		console.log(visibleChatConversation);
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
				a.setAttribute("download", `chat-history--${data.model.id}.${format}`);
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
						{#if item.vote === 1}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-green-600">
								<path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
							</svg>
						
						{:else if item.vote === -1}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-red-600">
							<path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
						</svg>
						
						{/if}
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
