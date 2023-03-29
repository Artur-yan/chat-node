<script>
import ChatWindow from "./ChatWindow.svelte";
import ChatBubble from "./ChatBubble.svelte";
import ChatInput from "./ChatInput.svelte";

let messages = [
    'What can I help you with?'
]

let input = '';

function addMessage() {
    messages = [...messages, input];
    input = '';
}

</script>

<div class="h-screen p-4">
    <ChatWindow {messages}>
        {#each messages as message, i}
            <ChatBubble {message} side={i % 2 == 0 ? 'left' : 'right'} />
        {/each}
        <ChatInput bind:input on:submit={addMessage} />
    </ChatWindow>
</div>

