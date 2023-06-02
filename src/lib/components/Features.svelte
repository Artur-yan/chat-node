<script>
    import Icon from "@iconify/svelte";
</script>

<section class="p-10 grid grid-cols-3 border-y border-neutral divide divide-neutral">
    <div>
        <h2><Icon icon="grommet-icons:stripe" class="text-[#635BFF]" width={24} />Stripe integration</h2>
        
        <p>With just a couple clicks you can connect any of your ai bots trained on your data to any/all of your slack workspaces and get brilliant responses about your data without ever leavng your slack channel.</p>
    </div>
    <div>       
        <h2><Icon icon="fluent:chat-12-regular" class="text-secondary" width={30} />Chatbot</h2>
        <p>Stop fielding customer support emails, responding to the same questions over and over. Let our custom trained AI chatbot give intelligent automated responses to your audience in your voice and with your data.</p>
    </div>
    <div>
        <h2><Icon icon="iconoir:code" class="text-accent" width={32} />Embed anywhere</h2>
        <p>Paste our iframe code anywhere on any site to stream your custom AI powered bot wherever you'd like.</p>
    </div>
    <div>
        <h2><Icon icon="ic:twotone-invert-colors" class="text-primary" width={32} />Custom design</h2>
        <p>Pick from a handful of slick colorways for your AI chat interface or customize each color to match your brand.</p>
    </div>
    <div>
        <h2><Icon icon="ri:exchange-funds-fill" class="text-warning" width={32} />Hyperspeed iteration</h2>
        <p>Add or remove data and change your AI prompt without ever leaving the chatbot with our unique UI for superfast experimentation to get the absolute best results.</p>
    </div>
    <div>
        <h2><Icon icon="basil:lock-solid" class="text-error" width={32} />Public or private</h2>
        <p>Keep your bot private for a personal edge, share it with the world, or deploy it for your team to sort through big data.</p>
    </div>

</section>

<style lang="postcss">
    section > div{
        @apply p-8 lg:p-10 xl:p-12 2xl:p-14;
    }

    h2{
        @apply text-white text-2xl font-bold mb-4 flex items-center gap-4
    }

    p{
        @apply max-w-2xl
    }
</style>