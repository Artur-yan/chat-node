<script lang="ts">
	import { Remarkable } from 'remarkable';
	import tiersMap from '$lib/data/tiers';
	import '$lib/assets/css/chat.postcss';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	let busyExporting = false;
	import { alert } from '$lib/stores';
	import { currentBot } from '$lib/stores';

	export let data;

	let isFetchingStats = false;

	let supportHoursSavedFormated = data.supportHoursSavedFormated;
	let numberOfChats = data.numberOfChats;
	let messages = data.messages;
	let averageMessagesPerChat = data.messages / data.numberOfChats;
	let numberOfLikes = data.numberOfLikes;
	let numberOfDislikes = data.numberOfDislikes;

	
	let dropdown: HTMLSelectElement;
	let timeSpan = 'Last 30 Days';
	$: console.log(timeSpan);

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

	async function getStats() {
		isFetchingStats = true;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({botId: $currentBot.id, timeSpan})
		};
		const response = await fetch(`/api/stats`, options);
		const data = await response.json();
		console.log(data);
		supportHoursSavedFormated = data.supportHoursSavedFormated;
		numberOfChats = data.numberOfChats;
		messages = data.messages;
		averageMessagesPerChat = data.averageMessagesPerChat;
		numberOfLikes = data.numberOfLikes;
		numberOfDislikes = data.numberOfDislikes;
		isFetchingStats = false;
	}
</script>

<div class="w-full">
	<div class="w-full ml-4 overflow-x-auto">

		<div class="flex justify-start items-center gap-3 my-4">
			<!-- Dropdown -->
			<select class="select select-bordered select-tiny w-full max-w-xs ml-4" bind:this={dropdown} on:change={() => {
				timeSpan = dropdown.value;
				getStats();
			}}>
				<!-- <option disabled selected>Duration</option> -->
				<option>Last 24 Hours</option>
				<option>Last 7 Days</option>
				<option selected>Last 30 Days</option>
			</select>
	
			{#if isFetchingStats}
				<div class="loading loading-spinner loading-md text-primary"></div>
			{/if}
		</div>

		<div class="stats shadow">

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
					</svg>								
				</div>
				<div class="stat-title">Support Hours Saved</div>
				<div class="stat-value">{supportHoursSavedFormated}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>
  
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
					</svg>					
				</div>
				<div class="stat-title">Conversations</div>
				<div class="stat-value">{numberOfChats}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
					</svg>									
				</div>
				<div class="stat-title">Total Messages</div>
				<div class="stat-value">{messages}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>
			
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
					</svg>				
				</div>
				<div class="stat-title">Average # of Messages</div>
				<div class="stat-value">{averageMessagesPerChat.toFixed(2)}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>
			
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
					</svg>	
				</div>
				<div class="stat-title"># of Likes</div>
				<div class="stat-value">{numberOfLikes}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
					</svg>
				</div>
				<div class="stat-title"># of Dislikes</div>
				<div class="stat-value">{numberOfDislikes}</div>
				<div class="stat-desc">Last 30 days</div>
			</div>
			
		</div>
	</div>
</div>
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
							class="chat-{chat.session_id} border border-base-200 my-2 p-2 w-full flex items-center cursor-pointer"
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
								<div class="m-1">
									{#if chat.likes !== 0 || chat.dislikes !== 0}
										<div class="flex gap-2">
												<div class="badge bg-slate-700 badge-md">{chat.likes}
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mx-1 text-green-400">
														<path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
													</svg>													
												</div>
												<div class="badge bg-slate-700 badge-md">{chat.dislikes}
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mx-1 text-red-400">
														<path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
													</svg>													
												</div>
										</div>
									{/if}
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
