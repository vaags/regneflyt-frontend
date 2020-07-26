<script lang="ts">
    export let min = 1
    export let max = 50
    export let zeroLabel: string | undefined = undefined
    export let value: number | undefined = undefined
    export let step: number = 1
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
            {step}
            bind:value />
    </span>
</div>
