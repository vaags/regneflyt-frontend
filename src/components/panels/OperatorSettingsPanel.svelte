<script lang="ts">
    import { slide } from 'svelte/transition'
    import type { AppSettings } from '../../models/AppSettings'
    import CardComponent from '../widgets/CardComponent.svelte'
    import AlertComponent from '../widgets/AlertComponent.svelte'
    import { Operator } from '../../models/constants/Operator'

    export let appSettings: AppSettings
    export let operator: Operator
    export let isAllOperators: boolean
    export let hasInvalidAdditionRange: boolean
    export let hasInvalidSubtractionRange: boolean

    export let possibleValues: Array<number>
    export let rangeMin: number
    export let rangeMax: number
    export let allowNegativeAnswer: boolean

    const minValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const maxValues = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
</script>

<div
    transition:slide|local="{appSettings.transitionDuration}"
    class="mb-1 md:mb-2"
>
    <CardComponent
        heading="{operator === Operator.Multiplication
            ? 'Multiplikand'
            : operator === Operator.Division
            ? 'Divisor'
            : 'Tallområde'}"
        label="{isAllOperators
            ? appSettings.operatorLabels[operator]
            : undefined}"
    >
        {#if operator === Operator.Multiplication || operator === Operator.Division}
            {#each Array(12) as _, i}
                <div>
                    <label class="inline-flex items-center py-1">
                        <input
                            type="checkbox"
                            class="h-5 w-5 rounded text-blue-700"
                            bind:group="{possibleValues}"
                            value="{i + 1}"
                        />
                        <span class="ml-2 text-lg">{i + 1}</span>
                    </label>
                </div>
            {/each}
        {:else}
            <div class="flex flex-row place-items-center mb-1">
                <label class="mr-3 text-lg" for="partOneMin-{operator}"
                    >Fra</label
                >
                <select
                    class="rounded text-lg"
                    id="partOneMin-{operator}"
                    bind:value="{rangeMin}"
                >
                    {#each minValues as v}
                        <option value="{v}">
                            {v}
                        </option>
                    {/each}
                </select>
                <label for="partOneMax-{operator}" class="mx-3 text-lg">
                    til
                </label>
                <select
                    class="rounded text-lg"
                    id="partOneMax-{operator}"
                    bind:value="{rangeMax}"
                >
                    {#each maxValues as v}
                        <option value="{v}">
                            {v}
                        </option>
                    {/each}
                </select>
            </div>
            {#if (operator === Operator.Addition && hasInvalidAdditionRange) || (operator === Operator.Subtraction && hasInvalidSubtractionRange)}
                <div
                    transition:slide|local="{appSettings.transitionDuration}"
                    class="mt-4"
                >
                    <AlertComponent color="red">
                        Intervallet er ugyldig.
                    </AlertComponent>
                </div>
            {/if}
            {#if operator === Operator.Subtraction}
                <label class="inline-flex items-center mt-4 text-lg">
                    <input
                        type="checkbox"
                        class="h-5 w-5 text-blue-700 rounded"
                        bind:checked="{allowNegativeAnswer}"
                    />
                    <span class="ml-2">Tillat negative svar</span>
                </label>
            {/if}
        {/if}
    </CardComponent>
</div>
