<script lang="ts">
	import { marked } from 'marked';

	export let data;

	console.log(data.chats);

	let visibleChatConversation;

	const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	// function getUniqueSortedValues(data, uniqueProperty) {
	// 	const uniqueValues = [...new Set(data.map((item) => item[uniqueProperty]))];

	// 	uniqueValues.sort((a, b) => {
	// 		return Number(b.split('-')[1]) - Number(a.split('-')[1]);
	// 	});
	// 	return uniqueValues;
	// }

	let currentActiveChatID: string;
	const getChatConversation = async (chat_session_id) => {
		const res = await fetch(`/api/chat-history/${chat_session_id}`, {
			method: 'GET'
		});
		const data = await res.json();

		visibleChatConversation = data;
		if (currentActiveChatID) {
			document.querySelector(`.${currentActiveChatID}`).classList.remove('active');
		}
		currentActiveChatID = 'chat-' + chat_session_id;
		document.querySelector(`.${currentActiveChatID}`).classList.add('active');
	};

	let chatHistory = data.chats;

	const reverseSort = () => {
		chatHistory = chatHistory.reverse();
	};
</script>

<div class="container md:grid md:grid-cols-[320px_auto] max-h-[75vh] gap-4 h-full my-4">
	<div class="mb-4 overflow-y-auto bg-base-200 rounded-box">
		<ul class="menu" role="navigation">
			<li class="menu-title">Conversations</li>
			<div class="flex items-center justify-between px-4">
				<label for="sort" class="">By Date</label>
				<select class="select select-bordered select-sm" name="sort" on:change={reverseSort}>
					<option>Newest First</option>
					<option>Oldest First</option>
				</select>
			</div>
			{#if chatHistory.length == 0}
				<li class="menu-title text-base-content">No chat history</li>
			{/if}
			{#each chatHistory as chat}
				{@const date = chat.created_at.toLocaleString()}
				<li>
					<a
						class="chat-{chat.session_id}"
						on:click|preventDefault={() => getChatConversation(chat.session_id)}>{date}</a
					>
				</li>
			{/each}
		</ul>
	</div>

	<div class="h-full overflow-y-auto rounded-lg border border-secondary p-4">
		{#if visibleChatConversation}
			{#each visibleChatConversation as item}
				<div class="chat" class:chat-end={item.message.type == 'human'}>
					<div class="chat-bubble">
						{@html postProcessMsgHTML(
							marked.parse(item.message.data.content, { mangle: false, headerIds: false })
						)}
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
	.active{
		@apply border-secondary border
	}
</style>