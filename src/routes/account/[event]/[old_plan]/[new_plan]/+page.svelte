<script>
    import { page } from "$app/stores";
    import tiersMap from "$lib/data/tiers";

    const event = $page.params.event;
</script>


<div class="container py-10">

        {#if event == 'convert'}
            <h1>Thanks for becoming a customer!</h1>
        {:else if event == 'upgrade'}
            <h1>Thanks for upgrading!</h1>
            <p class="text-lg">You are now on the <span class="text-primary font-bold">{tiersMap[$page.params.new_plan].name}</span> plan</p>
        {:else if event == 'downgrade'}
            <h1>Plan Changed!</h1>
            <p class="text-lg">You are now on the <span class="text-primary font-bold">{tiersMap[$page.params.new_plan].name}</span> plan</p>
        {:else if event == 'cancel'}
            <h1>We're sorry to see you go.</h1>
            <p>If there's something we could have done to keep you as a customer, please let us know.</p>
        {/if}
        <a href='/account/chatbots' class="btn btn-primary mt-8">Go to Dashboard</a>
    
</div>

<style>
    h1{
        @apply text-3xl font-bold mb-8;
    }
</style>