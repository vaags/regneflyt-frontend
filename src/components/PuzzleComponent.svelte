<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import TweenedValueComponent from './widgets/TweenedValueComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import PuzzleInputComponent from './widgets/PuzzleInputComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import { TimerState } from '../models/enums/TimerState'

    export let quiz: Quiz
    export let showWarning: boolean
    export let seconds: number

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
        puzzle.timeout = false
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
        await tick() // Wait for timeoutcomponent to reset puzzle timer (it listens to the puzzleTimeoutState value)
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
        <div
            class="float-right {quizAlmostFinished ? 'text-yellow-700 font-semibold' : 'text-gray-700'}">
            <TimeoutComponent
                {seconds}
                state="{quizTimeoutState}"
                on:secondChange="{secondChange}"
                on:finished="{quizTimeout}"
                showMinutes="{true}" />
        </div>
        <h2>Oppgave {puzzleNumber}</h2>
        <div class="my-8 text-center text-3xl md:text-4xl">
            <div>
                {#each puzzle.parts as part, i}
                    {#if puzzle.unknownPuzzlePartNumber === i}
                        <PuzzleInputComponent
                            disabled="{puzzle.timeout}"
                            focus="{!showWarning}"
                            {displayError}
                            bind:value="{part.userDefinedValue}" />
                    {:else}
                        <TweenedValueComponent value="{part.generatedValue}" />
                    {/if}
                    {#if i === 0}
                        <span>
                            <OperatorComponent operator="{puzzle.operator}" />
                        </span>
                    {:else if i === 1}
                        <span class="mr-2">=</span>
                    {/if}
                {/each}
            </div>
            {#if quiz.puzzleTimeLimit}
                <div class="mt-12">
                    <TimeoutComponent
                        state="{puzzleTimeoutState}"
                        showProgressBar="{true}"
                        seconds="{quiz.puzzleTimeLimit}"
                        on:finished="{timeOutPuzzle}">
                        {#if puzzle.timeout}
                            <TimeoutComponent
                                seconds="{3}"
                                fadeOnSecondChange="{true}"
                                on:finished="{() => (puzzle = generatePuzzle(puzzle, true))}" />
                        {:else}
                            {@html '&nbsp;'}
                        {/if}
                    </TimeoutComponent>
                </div>
            {/if}
        </div>
    </div>
    <div class="float-left {puzzle.timeout ? 'animate-pulse' : ''}">
        <ButtonComponent
            disabled="{displayError}"
            on:click="{() => (puzzle.timeout ? (puzzle = generatePuzzle(puzzle, true)) : completePuzzleIfValid())}"
            label="Neste"
            color="{displayError ? 'red' : puzzle.timeout ? 'yellow' : 'green'}" />
    </div>
</form>
