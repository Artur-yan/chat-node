<script>
    export let open = false
</script>

<div class="fixed inset-0 z-50 items-center justify-center flex bg-neutral/50" class:hidden={!open} on:click|self={() => open = false} on:keydown={() => open = false}>
    <div class="modal-box">
        <slot />
    </div>
</div>
