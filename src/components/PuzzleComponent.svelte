<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import NumberInputComponent from './widgets/NumberInputComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import { Quiz } from '../models/Quiz'
    import { Puzzle } from '../models/Puzzle'
    import { PuzzlePart } from '../models/PuzzlePart'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    let puzzleTimeout = undefined

    let puzzleNumber = 0
    let validationError = false
    let startTime: number
    let missingUserInput: boolean

    let puzzle: Puzzle = {
        partOne: new PuzzlePart(),
        partTwo: new PuzzlePart(),
        answer: new PuzzlePart(),
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: undefined,
        unknownPuzzlePartNumber: undefined,
    }

    $: displayError = missingUserInput && validationError

    $: {
        switch (puzzle.unknownPuzzlePartNumber) {
            case 1: {
                missingUserInput = puzzle.partOne.userDefinedValue === undefined
                break
            }
            case 2: {
                missingUserInput = puzzle.partTwo.userDefinedValue === undefined
                break
            }
            case 3: {
                missingUserInput = puzzle.answer.userDefinedValue === undefined
                break
            }
        }
    }

    function generatePuzzle() {
        puzzleNumber++

        puzzle = getPuzzle(quiz, puzzleNumber === 1 ? undefined : puzzle)

        startTime = Date.now()

        if (quiz.puzzleTimeLimit) setPuzzleTimeout()

        function setPuzzleTimeout() {
            clearTimeout(puzzleTimeout)
            puzzleTimeout = setTimeout(
                timeOutPuzzle,
                quiz.puzzleTimeLimit * 1000
            )
        }
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
        puzzle.isCorrect = evaluateAnswer(
            puzzle,
            puzzle.unknownPuzzlePartNumber
        )
        puzzle.duration = (Date.now() - startTime) / 1000

        dispatch('addPuzzle', { puzzle: { ...puzzle } })

        if (generateNextPuzzle) generatePuzzle()
    }

    function evaluateAnswer(puzzle: Puzzle, unknownPuzzlePart: Number) {
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
            case 3:
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

    onMount(() => {
        generatePuzzle()
    })

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
                    {displayError}
                    bind:value="{puzzle.partOne.userDefinedValue}" />
                <OperatorComponent operator="{puzzle.operator}" />
                {puzzle.partTwo.generatedValue} = {puzzle.answer.generatedValue}
            {:else if puzzle.unknownPuzzlePartNumber === 2}
                {puzzle.partOne.generatedValue}
                <OperatorComponent operator="{puzzle.operator}" />
                <NumberInputComponent
                    disabled="{puzzle.timeout}"
                    {displayError}
                    bind:value="{puzzle.partTwo.userDefinedValue}" />
                = {puzzle.answer.generatedValue}
            {:else}
                {puzzle.partOne.generatedValue}
                <OperatorComponent operator="{puzzle.operator}" />
                {puzzle.partTwo.generatedValue} =
                <NumberInputComponent
                    disabled="{puzzle.timeout}"
                    {displayError}
                    bind:value="{puzzle.answer.userDefinedValue}" />
            {/if}

        </div>
    </div>
    <div class="float-left">
        <ButtonComponent
            on:click="{() => (puzzle.timeout ? generatePuzzle() : completePuzzleIfValid())}"
            label="Neste"
            color="{displayError ? 'red' : 'green'}" />
    </div>
</form>
