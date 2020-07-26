<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import NumberInputComponent from './widgets/NumberInputComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import type { Quiz } from '../models/Quiz'
    import type { Puzzle } from '../models/Puzzle'

    export let quiz: Quiz
    export let showWarning: boolean

    const dispatch = createEventDispatcher()
    let puzzleTimeout: number | undefined = undefined

    let puzzleNumber = 0
    let validationError = false
    let startTime: number
    let missingUserInput: boolean

    let puzzle = generatePuzzle(undefined)

    $: displayError = missingUserInput && validationError

    $: {
        switch (puzzle.unknownPuzzlePartNumber) {
            case 1: {
                missingUserInput =
                    puzzle?.partOne?.userDefinedValue === undefined
                break
            }
            case 2: {
                missingUserInput =
                    puzzle?.partTwo?.userDefinedValue === undefined
                break
            }
            case 3: {
                missingUserInput =
                    puzzle?.answer?.userDefinedValue === undefined
                break
            }
        }
    }

    function generatePuzzle(previousPuzzle: Puzzle | undefined) {
        puzzleNumber++

        let puzzle = getPuzzle(quiz, previousPuzzle)

        startTime = Date.now()

        if (quiz.puzzleTimeLimit) setPuzzleTimeout()

        function setPuzzleTimeout() {
            clearTimeout(puzzleTimeout)
            puzzleTimeout = setTimeout(
                timeOutPuzzle,
                quiz.puzzleTimeLimit * 1000
            )
        }

        return puzzle
    }

    function completePuzzleIfValid() {
        if (!puzzleIsValid()) return

        clearTimeout(puzzleTimeout)
        completePuzzle(true)
    }

    function timeOutPuzzle() {
        puzzle.timeout = true
        validationError = false

        completePuzzle(false)
    }

    function completePuzzle(generateNextPuzzle: boolean) {
        clearTimeout(puzzleTimeout)
        puzzle.isCorrect = answerIsCorrect(
            puzzle,
            puzzle.unknownPuzzlePartNumber
        )
        puzzle.duration = (Date.now() - startTime) / 1000

        dispatch('addPuzzle', { puzzle: { ...puzzle } })

        if (generateNextPuzzle) puzzle = generatePuzzle(puzzle)
    }

    function answerIsCorrect(puzzle: Puzzle, unknownPuzzlePart: Number) {
        switch (unknownPuzzlePart) {
            case 1:
                return (
                    puzzle.partOne.userDefinedValue ===
                    puzzle.partOne.generatedValue
                )
            case 2:
                return (
                    puzzle.partTwo.userDefinedValue ===
                    puzzle.partTwo.generatedValue
                )
            default:
                return (
                    puzzle.answer.userDefinedValue ===
                    puzzle.answer.generatedValue
                )
        }
    }

    function puzzleIsValid() {
        if (missingUserInput) {
            validationError = true
            return
        }

        validationError = false

        return !validationError
    }

    onDestroy(() => {
        clearTimeout(puzzleTimeout)
    })
</script>

<form>
    <div class="card pb-6">
        <h2>Oppgave {puzzleNumber}</h2>
        {#if puzzle.timeout}
            <AlertComponent color="red" message="Tiden er ute." />
        {/if}
        <div class="text-center my-12 text-3xl md:text-4xl">
            {#if puzzle.unknownPuzzlePartNumber === 1}
                <NumberInputComponent
                    disabled="{puzzle.timeout}"
                    {showWarning}
                    {displayError}
                    bind:value="{puzzle.partOne.userDefinedValue}" />
                <OperatorComponent operator="{puzzle.operator}" />
                {puzzle.partTwo.generatedValue} = {puzzle.answer.generatedValue}
            {:else if puzzle.unknownPuzzlePartNumber === 2}
                {puzzle.partOne.generatedValue}
                <OperatorComponent operator="{puzzle.operator}" />
                <NumberInputComponent
                    disabled="{puzzle.timeout}"
                    {showWarning}
                    {displayError}
                    bind:value="{puzzle.partTwo.userDefinedValue}" />
                = {puzzle.answer.generatedValue}
            {:else}
                {puzzle.partOne.generatedValue}
                <OperatorComponent operator="{puzzle.operator}" />
                {puzzle.partTwo.generatedValue} =
                <NumberInputComponent
                    disabled="{puzzle.timeout}"
                    {showWarning}
                    {displayError}
                    bind:value="{puzzle.answer.userDefinedValue}" />
            {/if}

        </div>
    </div>
    <div class="float-left">
        <ButtonComponent
            disabled="{displayError}"
            on:click="{() => (puzzle.timeout ? generatePuzzle(puzzle) : completePuzzleIfValid())}"
            label="Neste"
            color="{displayError ? 'red' : 'green'}" />
    </div>
</form>
