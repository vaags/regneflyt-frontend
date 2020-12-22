<script lang="ts">
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: string | undefined = undefined
    export let isInfo: boolean = false
</script>

<div
    class="mb-1 md:mb-2 rounded-tl-md rounded-br-lg px-4 md:px-5 pt-3 md:pt-4 pb-3 md:pb-5 border-b-2 border-l-4 
    {isInfo ? 'bg-blue-50 border-blue-500' : 'bg-gray-100 border-gray-500'}">
    <div class="flex justify-between">
        {#if heading}
            <h2
                class="text-3xl md:text-4xl tracking-tight font-light -mt-1 mb-5 md:mb-6 text-gray-700">
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
