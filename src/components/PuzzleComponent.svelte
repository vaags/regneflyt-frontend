<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy, tick } from 'svelte'
    import ButtonComponent from './widgets/ButtonComponent.svelte'
    import AlertComponent from './widgets/AlertComponent.svelte'
    import OperatorComponent from './widgets/OperatorComponent.svelte'
    import { getPuzzle } from '../services/puzzleService'
    import { Quiz } from '../models/Quiz'
    import { Operator } from '../models/Operator'
    import { Puzzle } from '../models/Puzzle'

    export let quiz: Quiz

    const dispatch = createEventDispatcher()
    let interval = undefined

    let puzzleNumber = 0
    let input
    let validationError = false
    let startTime: number

    let puzzle: Puzzle = {
        partOne: {
            index: undefined,
            value: undefined,
        },
        partTwo: {
            index: undefined,
            value: undefined,
        },
        answer: undefined,
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: undefined,
    }

    $: displayError = !puzzle.answer && validationError

    function generatePuzzle() {
        puzzleNumber++

        puzzle = getPuzzle(quiz, puzzle)

        focusInput()

        startTime = Date.now()

        if (quiz.puzzleTimeLimit) setPuzzleTimeout()

        function setPuzzleTimeout() {
            clearInterval(interval)
            interval = setTimeout(timeOutPuzzle, quiz.puzzleTimeLimit * 1000)
        }
    }

    function completePuzzleIfValid() {
        if (!puzzleIsValid()) return

        completePuzzle(true)
    }

    function timeOutPuzzle() {
        puzzle.timeout = true
        puzzle.answer = undefined
        validationError = false

        completePuzzle(false)
    }

    function completePuzzle(generateNextPuzzle: boolean) {
        puzzle.isCorrect = evaluateAnswer()
        puzzle.duration = (Date.now() - startTime) / 1000
        puzzle.operator = quiz.activeOperator

        dispatch('addPuzzle', { puzzle: { ...puzzle } })

        if (generateNextPuzzle) generatePuzzle()
    }

    async function focusInput() {
        // Must await dom-update when changing from disabled / un-disabled
        await tick()
        input.focus()
    }

    function evaluateAnswer() {
        switch (quiz.activeOperator) {
            case Operator.Addition:
                return (
                    puzzle.partOne.value + puzzle.partTwo.value ===
                    puzzle.answer
                )
            case Operator.Subtraction:
                return (
                    puzzle.partOne.value - puzzle.partTwo.value ===
                    puzzle.answer
                )
            case Operator.Multiplication:
                return (
                    puzzle.partOne.value * puzzle.partTwo.value ===
                    puzzle.answer
                )
            case Operator.Division:
                return (
                    puzzle.partOne.value / puzzle.partTwo.value ===
                    puzzle.answer
                )
        }
    }

    function puzzleIsValid() {
        if (puzzle.answer == undefined) {
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
        clearInterval(interval)
    })
</script>

<style>
    /* Remove arrows from number input */
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }
</style>

<form>
    <div class="card pb-6">
        <h2>Oppgave {puzzleNumber}</h2>
        {#if puzzle.timeout}
            <AlertComponent color="red" message="Tiden er ute." />
        {/if}
        <div class="text-center my-12 text-3xl md:text-4xl">
            {puzzle.partOne.value}
            <OperatorComponent operator="{quiz.activeOperator}" />
            {puzzle.partTwo.value} =
            <input
                disabled="{puzzle.timeout}"
                bind:this="{input}"
                bind:value="{puzzle.answer}"
                class="border {displayError ? 'validation-error-border' : ''}
                rounded w-24 py-2 px-3 leading-tight focus:outline-none"
                type="number"
                placeholder="?" />
        </div>
    </div>
    <div class="float-left">
        <ButtonComponent
            on:click="{puzzle.timeout ? generatePuzzle : completePuzzleIfValid}"
            label="Neste"
            color="{displayError ? 'red' : 'green'}" />
    </div>
</form>
