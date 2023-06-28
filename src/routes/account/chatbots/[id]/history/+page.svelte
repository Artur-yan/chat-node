<script lang="ts">
    export let data;

    let visibleChatConversation

    function getUniqueSortedValues(data, uniqueProperty) {
        const uniqueValues = [...new Set(data.map(item => item[uniqueProperty]))];
        console.log(uniqueValues);
        
        uniqueValues.sort((a, b) => {
            return Number(b.split('-')[1]) - Number(a.split('-')[1])
        })
        return uniqueValues;
    }

    const getChatConversation = async (chat_session_id) => {
        const res = await fetch(`/api/chat-history/${chat_session_id}`, {
            method: 'GET'        
        });
        const data = await res.json();

        visibleChatConversation = data
    }

    const chatHistory = getUniqueSortedValues(data.chats, 'session_id');

</script>

<div class="container md:grid md:grid-cols-[320px_auto] max-h-[75vh] gap-10 h-full mt-4 mb-10">
    <div class="h-full overflow-y-auto">
        {#each chatHistory as chat}
        {@const date = new Date(Number(chat.split('-')[1])).toLocaleString()}
        <div>
            <button class="btn mb-2 w-full" on:click={() => getChatConversation(chat)}>
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