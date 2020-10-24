<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import HiddenValueCompontent from './widgets/HiddenValueComponent.svelte'
    import type { QuizScores } from '../models/QuizScores'
    import type { AppSettings } from '../models/AppSettings'
    import { postData } from '../services/apiService'
    import type { Highscore } from '../models/Highscore'
    import HighscoreTableComponent from './widgets/HighscoreTableComponent.svelte'

    const dispatch = createEventDispatcher()

    export let hasHighscore: boolean
    export let puzzleSet: Puzzle[]
    export let quizScores: QuizScores
    export let appSettings: AppSettings
    export let highScores: Highscore[]

    let userHighScore: Highscore = {
        scoreSum: 0,
        name: '',
    }

    let titleDom: any
    let apiRequestComplete: boolean = false
    let apiIsPosting: boolean = false
    let apiError: boolean = false
    let showCorrectAnswer: boolean = false
    let highscorePlacement: number

    async function postHighscore() {
        apiError = false
        apiIsPosting = true
        apiRequestComplete = false

        highScores = await postData(
            appSettings.apiEndpoint,
            appSettings.apiKey,
            userHighScore
        )

        if (!highScores) {
            apiError = true
        } else {
            apiRequestComplete = true
            dispatch('setHighscores', { highScores })
        }

        apiIsPosting = false
    }

    onMount(() => {
        if (hasHighscore) {
            userHighScore.scoreSum = quizScores.totalScore
            if (highScores?.length > 1) {
                highscorePlacement =
                    highScores.findIndex(
                        (s) => s.scoreSum < userHighScore.scoreSum
                    ) + 1
                if (!highscorePlacement) {
                    highscorePlacement = highScores.length + 1
                }
            } else {
                highscorePlacement = 1
            }
            titleDom.focus()
        }
    })

    function resetQuiz() {
        dispatch('resetQuiz')
    }
</script>

{#if hasHighscore}
    {#if apiRequestComplete}
        <div class="mb-4" transition:slide="{appSettings.transitionDuration}">
            <AlertComponent message="Ditt navn er lagret!" />
        </div>
    {:else}
        <form transition:slide="{appSettings.transitionDuration}">
            <div class="card">
                <h2>Gratulerer!</h2>
                <div class="mb-4">
                    <AlertComponent
                        message="Du fikk {quizScores.totalScore.toLocaleString()} poeng, og er nummer {highscorePlacement} i listen over de 10 beste! 🤩 Skriv inn initialene dine under for å vise det fram." />
                </div>
                <label>Initialer<br />
                    <input
                        type="text"
                        maxlength="3"
                        bind:this="{titleDom}"
                        class="form-input w-20 uppercase"
                        bind:value="{userHighScore.name}" />
                </label>
            </div>
            {#if apiError}
                <div class="mb-3">
                    <AlertComponent
                        color="red"
                        message="Det oppstod en feil ved lagring. Prøv igjen." />
                </div>
            {/if}
            <div class="mb-3">
                <ButtonComponent
                    on:click="{() => postHighscore()}"
                    disabled="{!userHighScore.name || apiIsPosting}"
                    color="{!userHighScore.name ? 'gray' : 'green'}">
                    {#if apiIsPosting}
                        <span class="animate-pulse">⚙️</span>
                    {:else}Lagre{/if}
                </ButtonComponent>
            </div>
        </form>
    {/if}
{/if}

<div class="card">
    <h2>Resultater</h2>
    {#if !puzzleSet?.length}
        <AlertComponent
            color="yellow"
            message="Ingen fullførte oppgaver ble funnet." />
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
</div>

{#if highScores}
    <div class="card">
        <h2>Topp 10</h2>
        <HighscoreTableComponent highScores="{highScores}" />
    </div>
{/if}

<ButtonComponent on:click="{resetQuiz}" color="green">Tilbake</ButtonComponent>
