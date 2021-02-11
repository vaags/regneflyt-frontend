<script lang="ts">
    import { slide } from 'svelte/transition'
    import type { AppSettings } from '../../models/AppSettings'
    import PanelComponent from '../widgets/PanelComponent.svelte'
    import AlertComponent from '../widgets/AlertComponent.svelte'
    import { Operator } from '../../models/constants/Operator'

    export let appSettings: AppSettings
    export let operator: Operator
    export let isAllOperators: boolean
    export let hasInvalidAdditionRange: boolean
    export let hasInvalidSubtractionRange: boolean
    export let rangeMin: number
    export let rangeMax: number

    const numbers =
        operator === Operator.Addition
            ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
            : [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50]
</script>

<PanelComponent
    heading="Tallområde"
    label="{isAllOperators ? appSettings.operatorLabels[operator] : undefined}"
>
    <p class="text-blue-700"></p>
    <div class="flex flex-row place-items-center mb-1">
        <label class="mr-3 text-lg" for="partOneMin-{operator}">Fra</label>
        <select
            class="rounded text-lg"
            id="partOneMin-{operator}"
            bind:value="{rangeMin}"
        >
            {#each numbers as n}
                <option value="{n}">
                    {n}
                </option>
            {/each}
        </select>
        <label for="partOneMax-{operator}" class="mx-3 text-lg"> til </label>
        <select
            class="rounded text-lg"
            id="partOneMax-{operator}"
            bind:value="{rangeMax}"
        >
            {#each numbers as n}
                <option value="{n + 10}">
                    {n + 10}
                </option>
            {/each}
        </select>
    </div>
    {#if (operator === Operator.Addition && hasInvalidAdditionRange) || (operator === Operator.Subtraction && hasInvalidSubtractionRange)}
        <div
            transition:slide|local="{appSettings.transitionDuration}"
            class="mt-4"
        >
            <AlertComponent color="red">Intervallet er ugyldig.</AlertComponent>
        </div>
    {/if}
</PanelComponent>
