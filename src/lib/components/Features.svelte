<script>
    import Icon from "@iconify/svelte";
</script>

<section class="p-10 md:p-16 lg:p-20 gap-16 2xl:gap-20 grid md:grid-cols-2  lg:grid-cols-3 border-y border-neutral divide divide-neutral bg-base-300">
    <div>
        <h2 class="text-accent"><Icon icon="iconoir:code" width={32} class="text-inherit" />Embed anywhere</h2>
        <p>Paste our iframe code anywhere on any site to stream your custom AI powered bot wherever you'd like.</p>
    </div>
    <div>       
        <h2 class="text-secondary"><Icon icon="fluent:chat-12-regular" class="text-secondary" width={30} />Chatbot</h2>
        <p>Stop fielding customer support emails, responding to the same questions over and over. Let our custom trained AI chatbot give intelligent automated responses to your audience in your voice and with your data.</p>
    </div>
    <div>
        <h2 class="text-[#34C5F0]"><Icon icon="devicon:slack" width={24} />Slack integration</h2>
        
        <p>With just a couple clicks you can connect any of your AI bots, trained on your data, to any/all of your slack workspaces and get brilliant responses about your data without ever leaving your slack channel.</p>
    </div>
    <div>
        <h2 class="text-primary"><Icon icon="ic:twotone-invert-colors" width={32} />Custom design</h2>
        <p>Pick from a handful of slick colorways for your AI chat interface or customize each color to match your brand.</p>
    </div>
    <div>
        <h2 class="text-primary"><Icon icon="ic:twotone-invert-colors" width={32} />Custom prompts</h2>
        <p>You can cutomise your chat gpt prompts</p>
    </div>
    <div>
        <h2 class="text-primary"><Icon icon="ic:twotone-invert-colors" width={32} />Multiple data sources</h2>
        <p>docs, pdfs, text, websites, with more coming soon</p>
    </div>
    <div>
        <h2 class="text-warning"><Icon icon="ri:exchange-funds-fill" width={32} />Hyperspeed iteration</h2>
        <p>Our unique interface allow you to add data sources, remove them, change your GPT prompts and settings all without ever leaving the chatbot for superfast experimentation to get the absolute best results.</p>
    </div>
    <div>
        <h2 class="text-error"><Icon icon="basil:lock-solid" width={32} />Public or private</h2>
        <p>Keep your bot private for a personal edge, share it with the world for customer support, or deploy it just for your team to navigate your company resources.</p>
    </div>

</section>

<style lang="postcss">
    section > div{
    }

    h2{
        @apply text-2xl font-bold mb-4 flex items-center gap-4
    }

    p{
        @apply max-w-2xl
    }
</style>