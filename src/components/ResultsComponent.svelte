<script lang="ts">
    import type { Puzzle } from '../models/Puzzle'
    import { createEventDispatcher, onMount } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import HiddenValueCompontent from './widgets/HiddenValueComponent.svelte'
    import type { QuizScores } from '../models/QuizScores'
    import type { AppSettings } from '../models/AppSettings'
    import { postData } from '../services/apiService'
    import type { Highscore } from '../models/Highscore'

    const dispatch = createEventDispatcher()

    export let hasHighscore: boolean
    export let puzzleSet: Puzzle[]
    export let quizScores: QuizScores
    export let appSettings: AppSettings
    export let highScores: Highscore[]

    let userHighScore: Highscore = {
        id: 0,
        scoreSum: 0,
        name: '',
    }
    let titleDom: any
    let apiRequestComplete: boolean = false
    let apiIsPosting: boolean = false

    async function postHighscore() {
        if (hasHighscore) {
            apiIsPosting = true
            apiRequestComplete = false

            highScores = await postData(appSettings.endpoint, userHighScore)

            console.log('new highscore', highScores)

            apiIsPosting = false
            apiRequestComplete = true
        }
    }

    onMount(() => {
        if (hasHighscore) userHighScore.scoreSum = quizScores.totalScore
    })

    function resetQuiz() {
        dispatch('resetQuiz')
    }
</script>

{#if hasHighscore && !apiRequestComplete}
    <div class="card">
        <h2>Gratulerer!</h2>
        <AlertComponent
            color="blue"
            message="Du har fått en highscore! 🤩 Skriv inn navnet ditt under for å vise det til alle andre." />
        <form class="mt-4">
            <label>Navn<br />
                <input
                    type="text"
                    maxlength="20"
                    bind:this="{titleDom}"
                    class="form-input w-3/4"
                    bind:value="{userHighScore.name}" />
            </label>
        </form>
    </div>
    <div class="mb-3">
        <ButtonComponent
            label="Lagre"
            on:click="{() => postHighscore()}"
            disabled="{!userHighScore.name || apiIsPosting}"
            color="{!userHighScore.name ? 'gray' : 'green'}" />
    </div>
{/if}

<div class="card">
    <h2>Highscores</h2>

    <table class="table-auto w-full">
        {#each highScores as score, i}
            <tr>
                <td class="border-t py-2 text-gray-600">{i + 1}</td>
                <td class="border-t px-4 py-2">{score.name}</td>
                <td class="border-t px-4 py-2 whitespace-no-wrap">
                    {score.scoreSum.toLocaleString()}
                </td>
            </tr>
        {/each}
    </table>
</div>

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
                        <td class="border-t py-2 text-gray-600">{i + 1}</td>
                        <td class="border-t px-4 py-2 whitespace-no-wrap">
                            {#each puzzle.parts as part, i}
                                {#if puzzle.unknownPuzzlePart === i}
                                    <HiddenValueCompontent
                                        value="{puzzle.timeout ? '?' : part.userDefinedValue}"
                                        showHiddenValue="{false}"
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
                        {quizScores.correctAnswerPercentage} % <span
                            class="text-sm">
                            ({quizScores.correctAnswerCount} av {puzzleSet.length})
                        </span>
                    </td>
                    <td class="border-t-2 px-3 py-2" colspan="{2}">
                        <span class="text-xl">{quizScores.totalScore}</span> poeng
                    </td>
                </tr>
            </tbody>
        </table>
    {/if}
</div>

<ButtonComponent on:click="{resetQuiz}" color="green" label="Ny runde" />
