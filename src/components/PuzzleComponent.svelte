<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte'
    import { slide } from 'svelte/transition'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import TweenedValueComponent from './widgets/TweenedValueComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import NumberInputComponent from './widgets/NumberInputComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import type { AppSettings } from '../models/AppSettings'
    import { TimerState } from '../models/enums/TimerState'

    export let quiz: Quiz
    export let showWarning: boolean
    export let seconds: number
    export let appSettings: AppSettings

    const dispatch = createEventDispatcher()
    let quizSecondsLeft: number = seconds

    let puzzleNumber = 0
    let validationError = false
    let startTime: number
    let missingUserInput: boolean
    let puzzleTimeoutState: TimerState = TimerState.Started
    let quizTimeoutState: TimerState = TimerState.Started

    let puzzle = generatePuzzle(undefined)

    $: displayError = missingUserInput && validationError
    $: quizAlmostFinished = quizSecondsLeft <= 5

    $: missingUserInput =
        puzzle.parts[puzzle.unknownPuzzlePartNumber].userDefinedValue ===
        undefined

    function generatePuzzle(
        previousPuzzle: Puzzle | undefined,
        resumeTimer: boolean = false
    ) {
        puzzleNumber++

        let puzzle = getPuzzle(quiz, previousPuzzle)
        puzzleTimeoutState = TimerState.Started

        if (resumeTimer) quizTimeoutState = TimerState.Resumed

        startTime = Date.now()

        return puzzle
    }

    function completePuzzleIfValid() {
        if (!puzzleIsValid()) return

        completePuzzle(true)
    }

    function timeOutPuzzle() {
        puzzle.timeout = true
        validationError = false

        quizTimeoutState = TimerState.Stopped
        puzzleTimeoutState = TimerState.Finished

        completePuzzle(false)
    }

    async function completePuzzle(generateNextPuzzle: boolean) {
        puzzleTimeoutState = TimerState.Stopped
        await tick()
        puzzle.isCorrect = answerIsCorrect(
            puzzle,
            puzzle.unknownPuzzlePartNumber
        )
        puzzle.duration = (Date.now() - startTime) / 1000

        dispatch('addPuzzle', { puzzle: { ...puzzle } })

        if (generateNextPuzzle) puzzle = generatePuzzle(puzzle)
    }

    function answerIsCorrect(puzzle: Puzzle, unknownPuzzlePart: number) {
        return (
            puzzle.parts[unknownPuzzlePart].userDefinedValue ===
            puzzle.parts[unknownPuzzlePart].generatedValue
        )
    }

    function puzzleIsValid() {
        if (missingUserInput) {
            validationError = true
            return
        }

        validationError = false

        return !validationError
    }

    function quizTimeout() {
        dispatch('quizTimeout')
    }

    function secondChange(event) {
        quizSecondsLeft = event.detail.remainingSeconds
    }
</script>

<form>
    <div class="card pb-6">
        {#if quiz.showRemainingTime}
            <div
                class="float-right {quizAlmostFinished ? 'text-yellow-700' : 'text-gray-700'}">
                <TimeoutComponent
                    {seconds}
                    state="{quizTimeoutState}"
                    on:secondChange="{secondChange}"
                    on:finished="{quizTimeout}"
                    showMinutes="{true}" />
            </div>
        {/if}
        <h2>Oppgave {puzzleNumber}</h2>
        <div class="my-12">
            {#if puzzle.timeout}
                <div
                    class="mb-4"
                    transition:slide|local="{appSettings.transitionDuration}">
                    <AlertComponent color="red" message="Tiden er ute." />
                </div>
            {/if}
            <div class="text-center text-3xl md:text-4xl">
                {#each puzzle.parts as part, i}
                    {#if puzzle.unknownPuzzlePartNumber === i}
                        <NumberInputComponent
                            disabled="{puzzle.timeout}"
                            focus="{!showWarning}"
                            {displayError}
                            bind:value="{part.userDefinedValue}" />
                    {:else}
                        <TweenedValueComponent value="{part.generatedValue}" />
                    {/if}
                    {#if i === 0}
                        <span class="mr-2">
                            <OperatorComponent operator="{puzzle.operator}" />
                        </span>
                    {:else if i === 1}
                        <span class="mr-2">=</span>
                    {/if}
                {/each}
                {#if quiz.puzzleTimeLimit}
                    <TimeoutComponent
                        state="{puzzleTimeoutState}"
                        invisible="{true}"
                        seconds="{quiz.puzzleTimeLimit}"
                        on:finished="{timeOutPuzzle}" />
                {/if}
            </div>
        </div>
    </div>
    <div class="float-left">
        <ButtonComponent
            disabled="{displayError}"
            on:click="{() => (puzzle.timeout ? (puzzle = generatePuzzle(puzzle, true)) : completePuzzleIfValid())}"
            label="Neste"
            color="{displayError ? 'red' : quizAlmostFinished ? 'yellow' : 'green'}" />
    </div>
</form>
