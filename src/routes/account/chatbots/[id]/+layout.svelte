<script lang="ts">
    import type { LayoutData } from './$types';
    import Icon from '@iconify/svelte';

    export let data: LayoutData;
</script>

<div class="container sm:flex items-center py-4 justify-between gap-4">
    <div class="text-sm breadcrumbs text-secondary">
        <ul>
          <li><a href="/account/chatbots">Chatbots</a></li> 
          <li class="text-xl">{data.model.name}</li>
        </ul>
      </div>
    <!-- <div class="flex items-baseline">
        <h1 class="mr-2">{data.model.name}</h1>
        <div class="text-xs text-primary-500">id:{data.model.id}</div>
    </div> -->
    <div class="btn-group overflow-auto">
        <a href="/account/chatbots/{data.model.id}" class="btn btn-sm text-primary">
            <Icon icon="mdi:chat" width="18" class="mr-2" />
            Chat
        </a>
        <a href="/account/chatbots/{data.model.id}/embed" class="btn btn-sm text-primary">
            <Icon icon="mdi:code" width="18" class="mr-2" />
            Embed
        </a>
        <a href="/account/chatbots/{data.model.id}/settings" class="btn btn-sm text-primary">
            <Icon icon="mdi:settings" width="18" class="mr-2" />
            Settings
        </a>
    </div>
</div>

<slot />