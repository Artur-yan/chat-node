<script>
	import Img from '@zerodevx/svelte-img';
	import SlackIntegrationStart from '$lib/assets/Slack-integration--start.jpg?run';
	import SlackIntegrationAuth from '$lib/assets/Slack-integration--auth.jpg?run';

</script>



<div class="container py-10 !max-w-4xl">

    <div class="mb-10">
        <div class="badge badge-outline badge-secondary">Announcement</div>
        <h1 class="text-4xl font-bold my-3">Slack Integration</h1>
    </div>
    <p>
        We're excited to introduce Slack integration. With this addition, ChatNode makes integrating chatbots into Slack as simple as possible. In this quick article, we will check how to set it up and explore the benefits and capabilities of this integration, highlighting how it optimizes workflow and creates a more efficient team environment.
    </p>

    <h2>Setup</h2>

    <p>
        After creating your first chatbot, navigate to your chatbot and click on the "integrations" tab. It will redirect you to authenticate in the Slack workspace you want to use. You can add multiple workspaces for each bot by simply revisiting the integrations tab and repeating.
    </p>

    <Img src={SlackIntegrationStart} width={560} height={384} class="my-10 rounded shadow-xl" alt="Selecting a gpt chatbot to connect to slack" sizes="(min-width: 56rem) 560px, 100vw - 2rem"  />

    
    <p>
        At the end of the authentication, you should be redirected to Slack:
    </p>

    <Img src={SlackIntegrationAuth} width={2408} height={1327} class="my-10 rounded shadow-xl" alt="Connect slacks to your gpt chatbot" sizes="(min-width: 56rem) 54rem, 100vw - 2rem"/>


    <p>
         
After inviting the app to a channel you can just tag @chatnode.ai “your message” and chatnode will answer. You are ready. Enjoy!
    </p>

    <p>If you have any issue please contact us any time at <a href="mailto:contact@chatnode.ai" class="link">contact@chatnode.ai</a></p>

</div>

<style lang="postcss">
    h2{
        @apply mt-10 mb-3 text-2xl font-bold
    }
    p{
        @apply mb-10
    }
</style>
