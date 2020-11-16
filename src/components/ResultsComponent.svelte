<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import CardComponent from './widgets/CardComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import HiddenValueCompontent from './widgets/HiddenValueComponent.svelte'
    import type { QuizScores } from '../models/QuizScores'
    import type { AppSettings } from '../models/AppSettings'

    const dispatch = createEventDispatcher()

    export let puzzleSet: Puzzle[]
    export let quizScores: QuizScores
    export let appSettings: AppSettings

    let showCorrectAnswer: boolean = false

    function resetQuiz() {
        dispatch('resetQuiz')
    }
</script>

<CardComponent heading="Resultater">
    {#if !puzzleSet?.length}
        <AlertComponent color="yellow">
            Ingen fullførte oppgaver ble funnet.
        </AlertComponent>
    {:else}
        <label class="inline-flex items-center my-4">
            <input
                type="checkbox"
                class="form-checkbox text-blue-700 h-5 w-5
                    border-gray-500"
                bind:checked="{showCorrectAnswer}" />
            <span class="ml-2">Vis fasit</span>
        </label>
        <table class="table-auto w-full">
            <tbody>
                {#each puzzleSet as puzzle, i}
                    <tr>
                        <td class="border-t py-2 text-gray-600">{i + 1}</td>
                        <td class="border-t px-4 py-2 whitespace-no-wrap">
                            {#each puzzle.parts as part, i}
                                {#if puzzle.unknownPuzzlePart === i}
                                    <HiddenValueCompontent
                                        value="{puzzle.timeout ? '?' : part.userDefinedValue}"
                                        showHiddenValue="{showCorrectAnswer}"
                                        hiddenValue="{part.generatedValue}" />
                                {:else}<span>{part.generatedValue}</span>{/if}
                                {#if i === 0}
                                    <span>
                                        {@html appSettings.operatorSigns[puzzle.operator]}
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
                            {:else}<span title="Galt">❌</span>{/if}
                        </td>
                        <td class="border-t px-3 py-2 whitespace-no-wrap">
                            {Math.round(puzzle.duration * 10) / 10}
                            s
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
                        {quizScores.correctAnswerPercentage}
                        %
                        <span class="text-sm">
                            ({quizScores.correctAnswerCount}
                            av
                            {puzzleSet.length})
                        </span>
                    </td>
                    <td class="border-t-2 px-3 py-2" colspan="{2}">
                        <span
                            class="text-xl">{quizScores.totalScore.toLocaleString()}</span>
                        poeng
                    </td>
                </tr>
            </tbody>
        </table>
    {/if}
</CardComponent>

<ButtonComponent on:click="{resetQuiz}" color="green">Tilbake</ButtonComponent>
