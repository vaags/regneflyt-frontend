<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import PanelComponent from './widgets/PanelComponent.svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import HiddenValueCompontent from './widgets/HiddenValueComponent.svelte'
    import type { QuizScores } from '../models/QuizScores'
    import type { AppSettings } from '../models/AppSettings'
    import type { Quiz } from '../models/Quiz'
    import CheckmarkIconComponent from './icons/CheckmarkComponent.svelte'
    import CrossIconComponent from './icons/CrossComponent.svelte'
    import ClockIconComponent from './icons/ClockComponent.svelte'
    import StarComponent from './icons/StarComponent.svelte'
    import ArrowUpComponent from './icons/ArrowUpComponent.svelte'
    import ArrowDownComponent from './icons/ArrowDownComponent.svelte'
    import { getQuizTitle } from '../services/quizService'

    const dispatch = createEventDispatcher()

    export let puzzleSet: Puzzle[]
    export let quizScores: QuizScores
    export let appSettings: AppSettings
    export let quiz: Quiz

    let showComponent: boolean
    let showCorrectAnswer: boolean = false

    function getReady() {
        dispatch('getReady', {
            quiz: { ...quiz, previousScore: quizScores.totalScore },
        })
    }

    function resetQuiz() {
        dispatch('resetQuiz', { previousScore: quizScores.totalScore })
    }

    onMount(() => {
        setTimeout(() => {
            showComponent = true
        }, appSettings.pageTransitionDuration.duration)
    })
</script>

{#if showComponent}
    <div transition:fade="{appSettings.pageTransitionDuration}">
        <PanelComponent
            heading="Resultater"
            label="{getQuizTitle(quiz, appSettings)}"
        >
            {#if !puzzleSet?.length}
                <AlertComponent color="yellow">
                    Ingen fullførte oppgaver ble funnet.
                </AlertComponent>
            {:else}
                <label class="inline-flex items-center mb-4 text-lg">
                    <input
                        type="checkbox"
                        class="h-5 w-5 rounded text-blue-700"
                        bind:checked="{showCorrectAnswer}"
                    />
                    <span class="ml-2">Vis fasit</span>
                </label>
                <table class="table-auto w-full text-lg">
                    <tbody>
                        {#each puzzleSet as puzzle, i}
                            <tr>
                                <td class="border-t py-2 text-gray-600">
                                    {i + 1}
                                </td>
                                <td
                                    class="border-t px-3 md:px-4 py-2 whitespace-nowrap"
                                >
                                    {#each puzzle.parts as part, i}
                                        {#if puzzle.unknownPuzzlePart === i}
                                            <HiddenValueCompontent
                                                value="{puzzle.timeout
                                                    ? '?'
                                                    : part.userDefinedValue}"
                                                showHiddenValue="{showCorrectAnswer}"
                                                hiddenValue="{part.generatedValue}"
                                                strong="{true}"
                                            />
                                        {:else}{part.generatedValue}{/if}
                                        {#if i === 0}
                                            <span>
                                                {@html appSettings
                                                    .operatorSigns[
                                                    puzzle.operator
                                                ]}
                                            </span>
                                        {:else if i === 1}
                                            <span class="mr-1">=</span>
                                        {/if}
                                    {/each}
                                </td>
                                <td class="border-t px-2 md:px-3 py-2">
                                    {#if puzzle.isCorrect}
                                        <CheckmarkIconComponent
                                            label="Riktig"
                                        />
                                    {:else if puzzle.timeout}
                                        <ClockIconComponent label="Timeout" />
                                    {:else}
                                        <CrossIconComponent label="Galt" />
                                    {/if}
                                </td>
                                <td
                                    class="border-t px-2 md:px-3 py-2 whitespace-nowrap"
                                >
                                    {Math.round(puzzle.duration * 10) / 10}
                                    <span class="text-sm">sek</span>
                                </td>
                                <td class="border-t px-2 md:px-3 py-2">
                                    {#if puzzle.isCorrect && puzzle.duration < 3}
                                        <StarComponent label="Bonuspoeng" />
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                        <tr>
                            <td
                                class="border-t-2 pr-2 md:pr-3 py-2 text-xl md:text-2xl"
                                colspan="{2}"
                            >
                                <div class="flex flex-row">
                                    <div class="mr-3">
                                        {quizScores.totalScore.toLocaleString()}
                                        poeng
                                    </div>
                                    <div>
                                        {#if quiz.previousScore !== undefined}
                                            {#if quizScores.totalScore > quiz.previousScore}
                                                <ArrowUpComponent
                                                    label="Bedre enn forrige runde"
                                                />
                                            {:else if quizScores.totalScore < quiz.previousScore}
                                                <ArrowDownComponent
                                                    label="Dårligere enn forrige runde"
                                                />
                                            {/if}
                                        {/if}
                                    </div>
                                </div>
                            </td>
                            <td
                                class="border-t-2 px-3 text-xl md:text-2xl md:px-4 py-2"
                                colspan="{3}"
                            >
                                {quizScores.correctAnswerPercentage}
                                %
                                <span class="text-sm md:text-base">
                                    ({quizScores.correctAnswerCount}
                                    av
                                    {puzzleSet.length})
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            {/if}
        </PanelComponent>

        <ButtonComponent on:click="{getReady}" color="green" margin="{true}">
            Start
        </ButtonComponent>
        <div class="float-right">
            <ButtonComponent on:click="{resetQuiz}">Hjem</ButtonComponent>
        </div>
    </div>
{/if}
