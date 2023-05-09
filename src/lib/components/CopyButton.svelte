<script lang="ts">
    export let textToCopy: string

    let copied = false

    const copyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        copied = true

        setTimeout(() => {
            copied = false
        }, 1000)
    }
</script>


<div class="tooltip tooltip-left transition-none" class:tooltip-success={copied} data-tip={copied ? 'Copied!' : 'Copy to clipboard' }>
    <button class="btn btn-ghost btn-sm btn-circle" on:click={() => copyToClipboard(textToCopy)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"/></svg>
    </button>
</div>