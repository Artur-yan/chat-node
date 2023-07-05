<script lang="ts">
	import { marked } from 'marked';
	import { current_component } from 'svelte/internal';

    export let data;

    let visibleChatConversation

    const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

    function getUniqueSortedValues(data, uniqueProperty) {
        const uniqueValues = [...new Set(data.map(item => item[uniqueProperty]))];
        
        uniqueValues.sort((a, b) => {
            return Number(b.split('-')[1]) - Number(a.split('-')[1])
        })
        return uniqueValues;
    }

    
    let currentActiveChatID: string
    const getChatConversation = async (chat_session_id) => {
        const res = await fetch(`/api/chat-history/${chat_session_id}`, {
            method: 'GET'        
        });
        const data = await res.json();

        visibleChatConversation = data
        if (currentActiveChatID){
            document.querySelector(`.${currentActiveChatID}`).classList.remove('btn-primary')
        }
        currentActiveChatID = 'chat-' + chat_session_id
        document.querySelector(`.${currentActiveChatID}`).classList.add('btn-primary')
    }

    const chatHistory = getUniqueSortedValues(data.chats, 'session_id');

</script>

<div class="container md:grid md:grid-cols-[320px_auto] max-h-[75vh] gap-10 h-full mt-4 mb-10">
    <div class="h-full overflow-y-auto">
        {#if chatHistory.length == 0}
            <p class="text-center">No chat history</p>
        {/if}
        {#each chatHistory as chat}
        {@const date = new Date(Number(chat.split('-')[1])).toLocaleString()}
        <div>
            <button class="btn mb-2 w-full chat-{chat}" on:click={() => getChatConversation(chat)}>
                <h2>{date}</h2>
            </button>
        </div>  
        {/each}
    </div>

    <div class="h-full overflow-y-auto rounded-lg border border-secondary p-4">

        {#if visibleChatConversation}
        {#each visibleChatConversation as item}
        <div class="chat" class:chat-end={item.message.type == "human"}>
            <div class="chat-bubble">
						{@html postProcessMsgHTML(marked.parse(item.message.data.content, {mangle: false, headerIds: false}))}

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