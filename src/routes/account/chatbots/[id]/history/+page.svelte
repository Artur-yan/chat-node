<script lang="ts">
	import { Remarkable } from 'remarkable';
	import { onMount } from 'svelte';
	import '$lib/assets/css/chat.postcss';

	export let data;

	const md = new Remarkable();

	let chatHistory = data.chats;
	let visibleChatConversation;
	let currentActiveChatID;

	const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	const getChatConversation = async (chat) => {
		const res = await fetch(`/api/chat-history/${chat.session_id}`, {
			method: 'GET'
		});
		const data = await res.json();

		visibleChatConversation = chat;

		visibleChatConversation.messages = data;
		document.querySelector(`.chat-${currentActiveChatID}`)?.classList.remove('active');
		currentActiveChatID = 'chat-' + chat.session_id;
		document.querySelector(`.${currentActiveChatID}`)?.classList.add('active');
	};

	onMount(() => {
		if (data.chats[0]?.session_id) {
			currentActiveChatID = 'chat-' + data.chats[0].session_id;
			getChatConversation(data.chats[0]);
		}
	});

	const reverseSort = () => {
		chatHistory = chatHistory.reverse();
		const match = document.querySelector(`.${currentActiveChatID}`);
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

<div class="container md:grid md:grid-cols-[320px_auto] gap-4 min-h-0 flex-1 basis-0 my-4">
	<div class="mb-4 overflow-y-scroll h-full bg-base-200 rounded-box">
		<ul class="menu divide-y divide-neutral" role="navigation">
			<li class="menu-title">Conversations</li>
			<div class="flex items-center justify-between px-4 py-2">
				<label for="sort" class="">By Date</label>
				<select class="select select-bordered select-xs" name="sort" on:change={reverseSort}>
					<option>Newest First</option>
					<option>Oldest First</option>
				</select>
			</div>
			{#if chatHistory.length === 0}
				<li class="menu-title text-base-content">No chat history</li>
			{:else}
				{#each chatHistory as chat}
					<!-- {chat.enduser_phone ? chat.enduser_phone : ''} -->
					<li>
						<button
							class="{chat.session_id} block my-2"
							on:click|preventDefault={() => getChatConversation(chat)}
							class:active={currentActiveChatID == `chat-${chat.session_id}`}
						>
							{#if chat.enduser_name || chat.enduser_email}
								<div class="text-secondary/70">
									<span>{chat.enduser_name ? chat.enduser_name : ''}</span>
									<span>{chat.enduser_email ? '<' + chat.enduser_email + '>' : ''}</span>
								</div>
							{/if}
							{formatDate(chat.created_at)}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	</div>

	<div class="h-full overflow-y-auto rounded-lg border border-secondary p-4">
		{#if visibleChatConversation}
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
							{@html postProcessMsgHTML(
								md.render(item.message.data.content)
							)}
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
