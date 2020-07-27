<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'

    const dispatch = createEventDispatcher()

    export let puzzleSet: Array<Puzzle>

    let correctAnswerSum: any
    let scorePercentage: any
    let totalTimeSpent: any

    onMount(() => {
        if (!puzzleSet || !puzzleSet.length) return

        const boolReducer = (accumulator, currentValue) =>
            accumulator + (currentValue ? 1 : 0)
        const intReducer = (accumulator, currentValue) =>
            accumulator + currentValue

        correctAnswerSum = puzzleSet.map((p) => p.isCorrect).reduce(boolReducer)

        scorePercentage = Math.round(
            (correctAnswerSum / puzzleSet.length) * 100
        )

        totalTimeSpent =
            Math.round(
                puzzleSet.map((p) => p.duration).reduce(intReducer) * 10
            ) / 10
    })

    function resetQuiz() {
        dispatch('resetQuiz')
    }
</script>

<div class="card">
    <h2>Resultater</h2>
    {#if !puzzleSet || !puzzleSet.length}
        <AlertComponent
            color="yellow"
            message="Ingen fullførte oppgaver ble funnet." />
    {:else}
        <table class="table-auto">
            <thead>
                <tr>
                    <th class="text-left py-2 font-light" colspan="{3}">
                        Svar
                    </th>
                    <th class="font-light px-3 py-2">Tidsbruk</th>
                </tr>
            </thead>
            <tbody>
                {#each puzzleSet as puzzle, i}
                    <tr>
                        <td
                            class="border-t py-2 whitespace-no-wrap
                            text-gray-600">
                            {i + 1}
                        </td>
                        <td class="border-t px-4 py-2">
                            {#each puzzle.parts as part, i}
                                {#if puzzle.unknownPuzzlePartNumber === i}
                                    <span class="font-bold text-blue-700">
                                        {puzzle.timeout ? '?' : part.userDefinedValue}
                                    </span>
                                {:else}
                                    <span>{part.generatedValue}</span>
                                {/if}
                                {#if i === 0}
                                    <span>
                                        <OperatorComponent
                                            operator="{puzzle.operator}" />
                                    </span>
                                {:else if i === 1}
                                    <span class="mr-1">=</span>
                                {/if}
                            {/each}
                        </td>
                        <td class="border-t px-3 py-2">
                            {#if puzzle.isCorrect}
                                <span class="text-green-700">Riktig</span>
                            {:else if puzzle.timeout}
                                <span class="text-yellow-700">Timeout</span>
                            {:else}
                                <span class="text-red-700">Galt</span>
                            {/if}
                        </td>
                        <td class="border-t px-3 py-2">
                            {Math.round(puzzle.duration * 10) / 10} s
                        </td>
                    </tr>
                {/each}
                <tr>
                    <td class="border-t-2 py-2 text-left" colspan="{2}">Sum</td>
                    <td class="border-t-2 px-3 py-2">
                        <span class="text-lg">{scorePercentage} %</span>
                        <span class="text-sm">
                            ({correctAnswerSum} av {puzzleSet.length})
                        </span>
                    </td>
                    <td class="border-t-2 px-3 py-2">{totalTimeSpent} s</td>
                </tr>
            </tbody>
        </table>
    {/if}
</div>

<ButtonComponent on:click="{resetQuiz}" label="Ny runde" />
