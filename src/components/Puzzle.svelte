<script>
    import { createEventDispatcher, onMount, onDestroy, tick } from 'svelte'
    import Button from './widgets/Button.svelte'
    import Alert from './widgets/Alert.svelte'
    import Operator from './widgets/Operator.svelte'

    export let quiz

    const dispatch = createEventDispatcher()
    let interval = undefined

    let puzzleNumber = 0
    let input
    let validationError = false
    let startTime

    let puzzle = {
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
        operator: quiz.activeOperator,
    }

    $: displayError = !puzzle.answer && validationError

    function generatePuzzle() {
        initializePuzzle()
        puzzleNumber++

        puzzle.partOne = getPuzzlePart(quiz.partOne, puzzle.partOne)
        puzzle.partTwo = getPuzzlePart(quiz.partTwo, puzzle.partTwo)

        if (shouldAvoidNegativeAnswer()) swapPuzzlePartValues()

        focusInput()

        startTime = Date.now()

        if (quiz.puzzleTimeLimit) setPuzzleTimeout()

        function setPuzzleTimeout() {
            clearInterval(interval)
            interval = setTimeout(timeOutPuzzle, quiz.puzzleTimeLimit * 1000)
        }

        function initializePuzzle() {
            puzzle.answer = undefined
            puzzle.isCorrect = undefined
            puzzle.duration = undefined
            puzzle.timeout = undefined
        }
    }

    function shouldAvoidNegativeAnswer() {
        return (
            !quiz.allowNegativeAnswer &&
            puzzle.operator == 'subtraksjon' &&
            puzzle.partTwo.value > puzzle.partOne.value
        )
    }

    function swapPuzzlePartValues() {
        ;[puzzle.partOne, puzzle.partTwo] = [puzzle.partTwo, puzzle.partOne]
    }

    function getPuzzlePart(quizPuzzlePart, previousPuzzlePart) {
        if (quizPuzzlePart.minValue === quizPuzzlePart.maxValue) {
            return {
                index: 0,
                value: quizPuzzlePart.minValue,
            }
        }

        return quizPuzzlePart.randomize
            ? getRandomPuzzlePartValue()
            : getNextPuzzlePartValue()

        function getRandomPuzzlePartValue() {
            let randomIndex = getRandomNumber(
                quizPuzzlePart.possibleValues.length,
                previousPuzzlePart.index
            )
            return {
                index: randomIndex,
                value: quizPuzzlePart.possibleValues[randomIndex],
            }

            function getRandomNumber(max, exclude) {
                // Adapted from https://stackoverflow.com/a/34184614
                var rnd = Math.floor(Math.random() * (max - 1))
                if (rnd >= exclude) rnd++

                return rnd
            }
        }

        function getNextPuzzlePartValue() {
            if (shouldReturnMinValue()) {
                return {
                    index: 0,
                    value: quizPuzzlePart.minValue,
                }
            }

            return {
                index: previousPuzzlePart.index + 1,
                value:
                    quizPuzzlePart.possibleValues[previousPuzzlePart.index + 1],
            }

            function shouldReturnMinValue() {
                return (
                    previousPuzzlePart.index === undefined ||
                    previousPuzzlePart.index ===
                        quizPuzzlePart.possibleValues.length - 1
                )
            }
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

        completePuzzle()
    }

    function completePuzzle(generateNextPuzzle) {
        puzzle.isCorrect = evaluateAnswer()
        puzzle.duration = (Date.now() - startTime) / 1000

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
            case 'addisjon':
                return (
                    puzzle.partOne.value + puzzle.partTwo.value ===
                    puzzle.answer
                )
            case 'subtraksjon':
                return (
                    puzzle.partOne.value - puzzle.partTwo.value ===
                    puzzle.answer
                )
            case 'multiplikasjon':
                return (
                    puzzle.partOne.value * puzzle.partTwo.value ===
                    puzzle.answer
                )
            case 'divisjon':
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
            <Alert color="red" message="Tiden er ute." />
        {/if}
        <div class="text-center my-12 text-3xl md:text-4xl">
            {puzzle.partOne.value}
            <Operator operator="{quiz.activeOperator}" />
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
        <Button
            on:click="{puzzle.timeout ? generatePuzzle : completePuzzleIfValid}"
            label="Neste"
            color="{displayError ? 'red' : 'green'}" />
    </div>
</form>
