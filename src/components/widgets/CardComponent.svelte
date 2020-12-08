<script lang="ts">
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: string | undefined = undefined
</script>

<div
    class="mb-1 md:mb-2 rounded-tl-md rounded-br-lg px-4 md:px-5 pt-3 md:pt-4 pb-3 md:pb-5 bg-gray-100">
    {#if heading}
        <h2
            class="text-3xl md:text-4xl font-light -mt-1 mb-5 md:mb-6 text-gray-700">
            {heading}
        </h2>
    {/if}
    <div class="flex-grow text-right">
        {#if label !== undefined}
            <LabelComponent>{label}</LabelComponent>
        {:else}
            <slot name="label" />
        {/if}
    </div>
    <slot />
</div>
