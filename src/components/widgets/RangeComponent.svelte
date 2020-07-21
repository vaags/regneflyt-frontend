<script lang="ts">
    export let min = 0
    export let max = 100
    export let zeroLabel: string = undefined
    export let value: number = undefined
</script>

<div class="flex flex-row mb-1 pt-2">
    <span class="text-blue-800 mr-4 w-8">
        {zeroLabel && !value ? zeroLabel : value}
    </span>
    <span class="w-full">
        <input
            on:change
            class="w-full slider"
            type="range"
            {min}
            {max}
            step="1"
            bind:value />
    </span>
</div>
