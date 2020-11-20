<script lang="ts">
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: string | undefined = undefined
</script>

<div class="mb-2 rounded px-4 py-3 bg-gray-100 md:mb-3 md:px-5 md:py-5">
    {#if label !== undefined}
        <LabelComponent>{label}</LabelComponent>
    {:else}
        <slot name="label" />
    {/if}
    {#if heading}
        <h2 class="mb-5 text-3xl -mt-1 font-light md:text-4xl md:-mt-2 md:mb-6">
            {heading}
        </h2>
    {/if}
    <slot />
</div>
