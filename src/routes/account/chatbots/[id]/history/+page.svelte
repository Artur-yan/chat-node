<script lang="ts">
	import { parse } from 'postcss';

    
    export let data;

    let visibleChatConversation

    function getUniqueSortedValues(data, uniqueProperty, sortProperty) {
        const uniqueValues = [...new Set(data.map(item => item[uniqueProperty]))];
        return uniqueValues.sort(data[sortProperty]);
    }

    const getChatConversation = async (chat_session_id) => {
        const res = await fetch(`/api/chat-history/${chat_session_id}`, {
            method: 'GET'        
        });
        const data = await res.json();
        console.log(data);

        visibleChatConversation = data
    }

    const chatHistory = getUniqueSortedValues(data.chats, 'session_id', 'created_at');

</script>

<div class="container md:grid md:grid-cols-[320px_auto] max-h-3/4 gap-10 h-full mt-4 mb-10">
    <div class="h-full overflow-y-auto">
        {#each chatHistory as chat}
        {@const date = new Date(Number(chat.split('-')[1])).toLocaleString()}
        <div>
            <button class="btn mb-2 w-full" on:click={() => getChatConversation(chat)}>
                    <h2>{date}</h2>
                    <!-- <h2>{chat.session_id}</h2>
                    <h3>{chat.created_at?.toLocaleString()}</h3> -->
            </button>
        </div>  
        {/each}
    </div>

    <div class="h-full overflow-y-auto rounded-lg border border-secondary p-4">

        {#if visibleChatConversation}
        {#each visibleChatConversation as item}
        <div class="chat" class:chat-end={item.message.type == "human"}>
            <div class="chat-bubble">
                        {item.message.data.content}
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