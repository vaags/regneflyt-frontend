<script lang="ts">
    export let min = 1
    export let max = 50
    export let value: number | undefined = undefined
    export let step: number = 1
    export let unitLabel: string | undefined = undefined
    export let largeLabel: boolean = false
    export let id: string | undefined = undefined
</script>

<div class="flex flex-row mb-1">
    <span class="text-blue-800 mr-4 {largeLabel ? 'w-20' : 'w-8'}">
        {value}
        {#if unitLabel}{unitLabel}{/if}
    </span>
    <span class="w-full">
        <input
            on:change
            {id}
            class="w-full slider"
            type="range"
            {min}
            {max}
            {step}
            bind:value />
    </span>
</div>
