<script>
    export let data;
    console.log(data);
</script>


<div class="container">
    <h1 class="text-2xl font-bold mb-4">Roadmap</h1>

    <div class="grid grid-cols-3 gap-8">
    {#each data.roadmap as item}
    
    {#if !item._pid}
    <div class="card bg-neutral">
        <div class="card-body ">
                <h2 class="card-title">{item.Title}</h2>
                {#each data.roadmap as subItem}
                {#if subItem._pid == item._id}
                <h3 class="alert">{subItem.Title}</h3>
                {/if}
                {/each}
                
            </div>
        </div>
                {/if}

    {/each}
</div>
</div>