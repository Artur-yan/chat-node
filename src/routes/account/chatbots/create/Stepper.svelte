<script>
    import { Indicator } from 'flowbite-svelte'
    import Icon from "@iconify/svelte";

    export let step = 1;

    let steps = [
        {
            title: "Train",
            icon: "mdi:gym"
        },
        {
            title: "Customize",
            icon: "mdi:tune"
        },
        {
            title: "Deploy",
            icon: "mdi:rocket-launch-outline"
        }
    ]
</script>



<ol class="flex items-center">
    {#each steps as {title, icon}, i}
        <li class="relative w-full mb-6">
            <div class="flex items-center gap-2">
                {#if step >= i}
                    <Icon {icon} height={16} />
                {:else}
                    <Icon icon="line-md:confirm-circle-twotone" height={20} />
                {/if}
                <h3>{title}</h3>
            </div>
        </li>
    {/each}
</ol>