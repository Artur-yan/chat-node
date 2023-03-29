<script>
    export let message = ""
    export let side = "left"

    let classes = "bg-indigo-500 text-white"

    if (side == 'right') {
        classes = "self-end bg-blue-300"
    }
</script>

<div class="p-4 rounded-lg max-w-2xl {classes}">
    {message}
</div>