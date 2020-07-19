<script>
    export let min = 0
    export let max = 100
    export let zeroLabel = undefined
    export let value = undefined
</script>

<div class="mb-4">
    <span class="text-blue-800 mr-4 float-left mt-1 w-8">
        {zeroLabel && !value ? zeroLabel : value}
    </span>
    <input
        on:change
        class="w-3/4 mt-2"
        type="range"
        {min}
        {max}
        step="1"
        bind:value />
</div>
