<script lang="ts">
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: string | undefined = undefined
</script>

<div
    class="mb-1 rounded-tl-md rounded-br-md md:ounded-tl-lg md:rounded-br-lg px-4 pt-3 pb-3 bg-gray-100 md:mb-2 md:px-5 md:pt-4 md:pb-5">
    <div class="flex flex-row">
        {#if heading}
            <h2 class="text-3xl font-light md:text-4xl -mt-1 mb-5 md:mb-6">
                {heading}
            </h2>
        {/if}
        <div class="flex-grow text-right {!heading ? 'mb-4' : ''}">
            {#if label !== undefined}
                <LabelComponent>{label}</LabelComponent>
            {:else}
                <slot name="label" />
            {/if}
        </div>
    </div>
    <slot />
</div>
