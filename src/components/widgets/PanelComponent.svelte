<script lang="ts">
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: string | undefined = undefined
</script>

<div
    class="mb-1 md:mb-2
    rounded-tl-lg rounded-br-lg
    px-4 md:px-6 py-3 md:py-5
    border-b-2 border-r border-l-4 bg-gray-100 border-gray-500"
>
    <div class="flex justify-between">
        {#if heading}
            <h2
                class="font-handwriting text-3xl md:text-4xl mb-5 md:mb-6 text-gray-700"
            >
                {heading}
            </h2>
        {/if}
        <div>
            {#if label !== undefined}
                <LabelComponent>{label}</LabelComponent>
            {:else}
                <slot name="label" />
            {/if}
        </div>
    </div>
    <slot />
</div>
