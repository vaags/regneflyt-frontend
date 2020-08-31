<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import HiddenValueCompontent from './widgets/HiddenValueComponent.svelte'
    import type { OperatorSettings } from '../models/OperatorSettings'
    import { getQuizScore } from '../services/scoreService'
    import type { Quiz } from '../models/Quiz'

    const dispatch = createEventDispatcher()

    export let puzzleSet: Puzzle[]
    export let quiz: Quiz

    let correctAnswerSum: any
    let scorePercentage: any
    let scoreSum: number

    onMount(() => {
        if (!puzzleSet || !puzzleSet.length) return

        const scoreSettings = getQuizScore(quiz)

        const boolReducer = (accumulator: any, currentValue: any) =>
            accumulator + (currentValue ? 1 : 0)

        scoreSum = puzzleSet
            .map((p) => getPuzzleScore(p, scoreSettings))
            .reduce((a, b) => a + b)

        correctAnswerSum = puzzleSet.map((p) => p.isCorrect).reduce(boolReducer)

        scorePercentage = Math.round(
            (correctAnswerSum / puzzleSet.length) * 100
        )
    })

    function getPuzzleScore(puzzle: Puzzle, scoreSettings: OperatorSettings[]) {
        const operatorScore = scoreSettings[puzzle.operator].score

        if (puzzle.isCorrect)
            return puzzle.duration < 3 ? operatorScore * 2 : operatorScore

        return operatorScore * -1
    }

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
        <table class="table-auto w-full">
            <tbody>
                {#each puzzleSet as puzzle, i}
                    <tr>
                        <td
                            class="border-t py-2 whitespace-no-wrap
                            text-gray-600">
                            {i + 1}
                        </td>
                        <td class="border-t px-4 py-2 whitespace-no-wrap">
                            {#each puzzle.parts as part, i}
                                {#if puzzle.unknownPuzzlePart === i}
                                    <HiddenValueCompontent
                                        value="{puzzle.timeout ? '?' : part.userDefinedValue}"
                                        showHiddenValue="{false}"
                                        hiddenValue="{part.generatedValue}" />
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
                                <span title="Riktig">✔</span>
                            {:else if puzzle.timeout}
                                <span title="Timeout">⌛</span>
                            {:else}
                                <span title="Galt">❌</span>
                            {/if}
                        </td>
                        <td class="border-t px-3 py-2 whitespace-no-wrap">
                            {Math.round(puzzle.duration * 10) / 10} s
                        </td>
                        <td class="border-t px-3 py-2">
                            {#if puzzle.isCorrect && puzzle.duration < 3}⭐{/if}
                        </td>
                    </tr>
                {/each}
                <tr>
                    <td class="border-t-2 py-2 text-gray-600" colspan="{2}">
                        Sum
                    </td>
                    <td class="border-t-2 px-4 py-2">
                        {scorePercentage} %
                        <span class="text-sm">
                            ({correctAnswerSum} av {puzzleSet.length})
                        </span>
                    </td>
                    <td class="border-t-2 px-3 py-2" colspan="{2}">
                        <span class="text-xl">{scoreSum}</span>
                        poeng
                    </td>
                </tr>
            </tbody>
        </table>
    {/if}
</div>

<ButtonComponent on:click="{resetQuiz}" color="green" label="Ny runde" />
