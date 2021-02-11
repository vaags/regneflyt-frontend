<script lang="ts">
    import type { AppSettings } from '../../models/AppSettings'
    import PanelComponent from '../widgets/PanelComponent.svelte'
    import { Operator } from '../../models/constants/Operator'

    export let appSettings: AppSettings
    export let operator: Operator
    export let isAllOperators: boolean

    export let possibleValues: Array<number>
</script>

<PanelComponent
    heading="{operator === Operator.Multiplication
        ? 'Multiplikand'
        : 'Divisor'}"
    label="{isAllOperators ? appSettings.operatorLabels[operator] : undefined}"
>
    {#each Array(12) as _, i}
        <div>
            <label class="inline-flex items-center py-1">
                <input
                    type="checkbox"
                    class="h-5 w-5 rounded text-blue-700"
                    bind:group="{possibleValues}"
                    value="{i}"
                />
                <span class="ml-2 text-lg">{i}</span>
            </label>
        </div>
    {/each}
</PanelComponent>
