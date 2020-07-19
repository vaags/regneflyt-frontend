<script>
    export let min = 0
    export let max = 100
    export let zeroLabel = undefined
    export let value = undefined
</script>

<div class="flex flex-row">
    <span class="text-blue-800 mr-4 mt-1 w-8">
        {zeroLabel && !value ? zeroLabel : value}
    </span>
    <span class="w-full mt-2">
        <input
            on:change
            class="w-full"
            type="range"
            {min}
            {max}
            step="1"
            bind:value />
    </span>
</div>
