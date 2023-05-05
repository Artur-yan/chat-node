<script lang="ts">
    import type { LayoutData } from './$types';
    import Icon from '@iconify/svelte';

    export let data: LayoutData;

    import BotStatus from '$lib/components/BotStatus.svelte';
</script>

<BotStatus />
<div class="container sm:flex items-center justify-between gap-4">
    <div class="text-sm breadcrumbs text-secondary">
        <ul>
          <li class="font-bold"><a href="/account/chatbots">&larr; Chatbots</a></li> 
          <li class="text-xl font-bold">{data.model.name}</li>
        </ul>
      </div>
    <div class="btn-group max-sm:overflow-x-scroll my-2">
        <a href="/account/chatbots/{data.model.id}" class="btn text-primary">
            <Icon icon="mdi:chat" width="18" class="mr-2" />
            Chat
        </a>
        <a href="/account/chatbots/{data.model.id}/embed" class="btn text-primary">
            <Icon icon="mdi:code" width="18" class="mr-2" />
            Embed
        </a>
        <a href="/account/chatbots/{data.model.id}/settings" class="btn text-primary">
            <Icon icon="mdi:settings" width="18" class="mr-2" />
            Settings
        </a>
    </div>
</div>

<slot />