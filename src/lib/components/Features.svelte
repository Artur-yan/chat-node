<script>
    import Icon from "@iconify/svelte";
</script>

<section class="p-10 grid grid-cols-3 border-y border-neutral divide divide-neutral">
    <div>
        <h2><Icon icon="grommet-icons:stripe" class="text-[#635BFF]" width={24} />Stripe integration</h2>
        
        <p>With just a couple click you can connect any of your bots to any/all of your slack workspaces and get brilliant responses about your data without ever leavng your slack channel.</p>
    </div>
    <div>       
        <h2><Icon icon="fluent:chat-12-regular" class="text-secondary" width={30} />Chatbot</h2>
        <p>Stop fielding customer support emails repsonding to the same questions over and over. Let our attractive ai chatbot give intelligent automated responses to your audience.</p>
    </div>
    <div>
        <h2><Icon icon="iconoir:code" class="text-accent" width={32} />Embed anywhere</h2>
        <p>Paste our iframe code anywhere on any site to stream your custom AI powered bot wherever you'd like.</p>
    </div>
    <div>
        <h2><Icon icon="ic:twotone-invert-colors" class="text-primary" width={32} />Custom design</h2>
        <p>Pick from a handful of slick colorways for your chat interface or customize every single coloir to match your brand.</p>
    </div>
    <div>
        <h2><Icon icon="ri:exchange-funds-fill" class="text-warning" width={32} />Hyperspeed iteration</h2>
        <p>Add and remove data, change your prompt, customize the colors, all without ever leaving the chatbot with our unique UI for superfast experimentation.</p>
    </div>
    <div>
        <h2><Icon icon="basil:lock-solid" class="text-error" width={32} />Public/Private</h2>
        <p>Keep your bot private for a personal edge, share it with the world, or deploy it for your team to sort through big data.</p>
    </div>

</section>

<style lang="postcss">
    section > div{
        @apply p-10;
    }

    h2{
        @apply text-white text-2xl font-bold mb-4 flex items-center gap-4
    }

    p{
    }
</style>