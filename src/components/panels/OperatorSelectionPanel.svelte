<script lang="ts">
    import { slide } from 'svelte/transition'
    import type { AppSettings } from '../../models/AppSettings'
    import PanelComponent from '../widgets/PanelComponent.svelte'
    import { Operator } from '../../models/constants/Operator'

    export let appSettings: AppSettings
    export let selectedOperator: Operator | 4 | undefined = undefined
</script>

<div transition:slide|local="{appSettings.transitionDuration}">
    <PanelComponent heading="Velg regneart">
        {#each Object.values(Operator) as operator, i}
            <label class="flex items-center py-1">
                <input
                    type="radio"
                    class="h-5 w-5 text-blue-700"
                    bind:group="{selectedOperator}"
                    value="{operator}"
                />
                <span class="ml-2 text-lg">{appSettings.operatorLabels[i]}</span
                >
            </label>
        {/each}
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="h-5 w-5 text-lg text-blue-700"
                bind:group="{selectedOperator}"
                value="{4}"
            />
            <span class="ml-2 text-lg">{appSettings.operatorLabels[4]}</span>
        </label>
    </PanelComponent>
</div>
