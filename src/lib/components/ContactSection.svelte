<script>
	import Accordian from '$lib/components/Accordian.svelte';
	import Chat from '$lib/components/Chat.svelte';

</script>

<section class="container grid grid-cols-2 gap-8 py-10 bg-accent/10">
    <div>
        <h2 class="text-2xl font-bold mb-2">Contact</h2>

        <a href="mailto:contact@chatnode.ai" class="link">contact@chatnode.ai</a>

        <h2 class="text-2xl font-bold mb-4 mt-10">FAQ</h2>
        <div class="space-y-4">
        <Accordian>
            <div slot="title">Is there a free plan?</div>
            Yes, just by signing up you get 30 message credits and 1 chatbot. You can use these to test out
            ChatNode and see if it works for you.
        </Accordian>
        <Accordian>
            <div slot="title">How much data can I give one chatbot?</div>
            Free plan: 100K tokens (~5MB) | Basic: 400K tokens (~24MB) | Pro: 800K tokens (~50MB) | Entreprise:
            1M tokens (~75MB)
        </Accordian>

        <Accordian>
            <div slot="title">Does it support other languages?</div>
            Yes, ChatNode supports about 95 languages. You can have your sources in any language and ask
            it questions in any language.
        </Accordian>

        <a href="/faq" class="btn">View all</a>
        </div>
    </div>
    
    <div class="flex flex-col">
        <h2 class="text-2xl font-bold mb-4">Questions? Try our chatbot</h2>
        <div class="h-full">
            <Chat modelId="7c92a03849aa49c4" />   
        </div>
    </div>
</section>
