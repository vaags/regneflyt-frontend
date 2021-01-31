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

    const numbers =
        operator === Operator.Addition
            ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
            : [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50]
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
                            value="{i}"
                        />
                        <span class="ml-2 text-lg">{i}</span>
                    </label>
                </div>
            {/each}
        {:else}
            <p class="text-blue-700"></p>
            <div class="flex flex-row place-items-center mb-1">
                <label class="mr-3 text-lg" for="partOneMin-{operator}"
                    >Fra</label
                >
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
                <label for="partOneMax-{operator}" class="mx-3 text-lg">
                    til
                </label>
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
                    <AlertComponent color="red">
                        Intervallet er ugyldig.
                    </AlertComponent>
                </div>
            {/if}
        {/if}
    </CardComponent>
</div>
