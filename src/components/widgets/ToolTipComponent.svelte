<!-- This is not in use atm -->
<script lang="ts">
    import { fade } from 'svelte/transition'
    export let tip: string
    export let isActive: boolean = false
</script>

<span
    class="relative cursor-pointer border-b border-gray-500 border-dashed"
    on:click="{() => (isActive = !isActive)}">
    <slot />
    {#if isActive}
        <span
            transition:fade="{{ duration: 150 }}"
            class="absolute w-48 -top-8 -left-10 bg-white rounded px-2 py-1 border border-gray-400"
            >{tip}</span
        >
    {/if}
</span>
