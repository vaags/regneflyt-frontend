<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import TweenedValueComponent from './widgets/TweenedValueComponent.svelte'
    import PuzzleInputComponent from './widgets/PuzzleInputComponent.svelte'
    import TimeoutComponent from './widgets/TimeoutComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import PanelComponent from './widgets/PanelComponent.svelte'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'
    import { TimerState } from '../models/constants/TimerState'
    import type { AppSettings } from '../models/AppSettings'

    export let quiz: Quiz
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
        puzzle.parts[puzzle.unknownPuzzlePart].userDefinedValue === undefined

    function generatePuzzle(
        previousPuzzle: Puzzle | undefined,
        resumeTimer: boolean = false
    ) {
        puzzleNumber++

        let puzzle = getPuzzle(quiz, appSettings.operatorSigns, previousPuzzle)
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
        let finishTime = Date.now()
        await tick() // Wait for timeoutcomponent to reset puzzle timer (it listens to the puzzleTimeoutState value)
        puzzle.isCorrect = puzzle.timeout
            ? false
            : answerIsCorrect(puzzle, puzzle.unknownPuzzlePart)
        puzzle.duration = (finishTime - startTime) / 1000

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

    function secondChange(event: any) {
        quizSecondsLeft = event.detail.remainingSeconds
    }
</script>

<form>
    <PanelComponent heading="Oppgave {puzzleNumber}">
        <div
            slot="label"
            class="float-right text-lg {quizAlmostFinished
                ? 'text-yellow-700 font-semibold'
                : 'text-gray-700'}"
        >
            <TimeoutComponent
                seconds="{seconds}"
                state="{quizTimeoutState}"
                on:secondChange="{secondChange}"
                on:finished="{quizTimeout}"
                showMinutes="{true}"
            />
        </div>
        <div class="mt-4 mb-2 text-center text-4xl md:text-5xl">
            <div class="mb-10">
                {#each puzzle.parts as part, i}
                    {#if puzzle.unknownPuzzlePart === i}
                        <PuzzleInputComponent
                            disabled="{puzzle.timeout}"
                            displayError="{displayError}"
                            bind:value="{part.userDefinedValue}"
                        />
                    {:else}
                        <TweenedValueComponent value="{part.generatedValue}" />
                    {/if}
                    {#if i === 0}
                        <span>
                            {@html puzzle.operatorLabel}
                        </span>
                    {:else if i === 1}<span class="mr-2">=</span>{/if}
                {/each}
            </div>
            {#if quiz.puzzleTimeLimit}
                <div class="text-lg">
                    <TimeoutComponent
                        state="{puzzleTimeoutState}"
                        showProgressBar="{true}"
                        seconds="{appSettings.puzzleTimeLimitDuration}"
                        on:finished="{timeOutPuzzle}"
                    >
                        {#if puzzle.timeout}
                            <TimeoutComponent
                                seconds="{appSettings.separatorPageDuration}"
                                countToZero="{false}"
                                fadeOnSecondChange="{true}"
                                on:finished="{() =>
                                    (puzzle = generatePuzzle(puzzle, true))}"
                            />
                        {:else}
                            {@html '&nbsp;'}
                        {/if}
                    </TimeoutComponent>
                </div>
            {/if}
        </div>
    </PanelComponent>
    <div class="float-left {puzzle.timeout ? 'animate-pulse' : ''}">
        <ButtonComponent
            disabled="{displayError}"
            on:click="{() =>
                puzzle.timeout
                    ? (puzzle = generatePuzzle(puzzle, true))
                    : completePuzzleIfValid()}"
            color="{displayError ? 'red' : puzzle.timeout ? 'yellow' : 'green'}"
        >
            Neste
        </ButtonComponent>
    </div>
</form>
