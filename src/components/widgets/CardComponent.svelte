<script lang="ts">
    import type { Operator } from '../../models/enums/Operator'
    import { getLabel } from '../../services/labelService'
    import LabelComponent from './LabelComponent.svelte'
    export let heading: string | undefined = undefined
    export let label: Operator | string | undefined = undefined
</script>

<div class="mb-2 rounded px-4 py-3 bg-gray-100 md:mb-3 md:px-5 md:py-4">
    {#if label !== undefined}
        <LabelComponent>
            {@html getLabel(label, true)}
        </LabelComponent>
    {/if}
    <slot name="label" />
    {#if heading}
        <h2 class="mb-4 text-2xl -mt-1 font-light md:text-3xl md:mb-4 md:-mt-2">
            {heading}
        </h2>
    {/if}
    <slot />
</div>
