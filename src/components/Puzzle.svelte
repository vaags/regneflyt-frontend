<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';

    const dispatch = createEventDispatcher();

    export let quiz

    let puzzleNumber = 0;

    let puzzle = {
        partOne: {
            index: undefined,
            value: undefined
        },
        partTwo: {
            index: undefined,
            value: undefined
        },
        answer: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: quiz.activeOperator,
    }

    let input;
    let validationError = false;
    let startTime;

    $: displayError = !puzzle.answer && validationError;

    function generatePuzzle() {
        puzzle.partOne = getPuzzlePart(quiz.partOne, puzzle.partOne)
        puzzle.partTwo = getPuzzlePart(quiz.partTwo, puzzle.partTwo)

        shouldAvoidNegativeAnswer() && swapPuzzlePartValues();

        puzzle.answer = undefined
        puzzle.isCorrect = undefined
        puzzle.duration = undefined
        puzzleNumber++
        input.focus()
        startTime = Date.now();
    }

    function shouldAvoidNegativeAnswer() {
        return (!quiz.allowNegativeAnswer && puzzle.operator == 'subtraksjon')
            && puzzle.partTwo.value > puzzle.partOne.value;
    }

    function swapPuzzlePartValues() {
        [puzzle.partOne, puzzle.partTwo] = [puzzle.partTwo, puzzle.partOne];
    }

    function getPuzzlePart(quizPuzzlePart, previousPuzzlePart) {

        if (quizPuzzlePart.minValue === quizPuzzlePart.maxValue)
            return {
                index: 0,
                value: quizPuzzlePart.minValue
            }
        if (quizPuzzlePart.randomize) {
            // Adapted from https://stackoverflow.com/a/34184614
            let randomIndex = Math.floor(Math.random() * (quizPuzzlePart.possibleValues.length - 1));
            if (randomIndex >= previousPuzzlePart.index) randomIndex++;

            return {
                index: randomIndex,
                value: quizPuzzlePart.possibleValues[randomIndex]
            };
        } else {
            if (previousPuzzlePart.index == undefined
                || previousPuzzlePart.index === quizPuzzlePart.possibleValues.length - 1) {
                return {
                    index: 0,
                    value: quizPuzzlePart.possibleValues[0]
                }
            } else {
                return {
                    index: previousPuzzlePart.index + 1,
                    value: quizPuzzlePart.possibleValues[previousPuzzlePart.index + 1]
                }
            }
        }
    }

    function completePuzzle() {
        if (!puzzleIsValid()) return;

        puzzle.isCorrect = evaluateAnswer();
        puzzle.duration = (Date.now() - startTime) / 1000;

        dispatch('addPuzzle', { puzzle: {...puzzle} });
        generatePuzzle()
    }

    function evaluateAnswer() {
        switch (quiz.activeOperator) {
            case 'addisjon':
                return puzzle.partOne.value + puzzle.partTwo.value === puzzle.answer;
            case 'subtraksjon':
                return puzzle.partOne.value - puzzle.partTwo.value === puzzle.answer;
            case 'multiplikasjon':
                return puzzle.partOne.value * puzzle.partTwo.value === puzzle.answer;
            case 'divisjon':
                return puzzle.partOne.value / puzzle.partTwo.value === puzzle.answer;
        }
    }

    function puzzleIsValid() {
        if (puzzle.answer == undefined) {
            validationError = true;
            input.focus()
            return;
        }

        validationError = false;

        return !validationError;
    }

    onMount(() => {
        generatePuzzle()
    })

</script>

<div class="card pb-6">
    <h2>Oppgave {puzzleNumber}</h2>
    <form>
        <div class="text-center my-12 text-4xl">{puzzle.partOne.value} <Operator operator={quiz.activeOperator} /> {puzzle.partTwo.value} = 
        <input
            bind:this={input}
            bind:value={puzzle.answer}
            class="border {displayError ? 'validation-error-border' : ''} rounded w-24 py-2 px-3 leading-tight focus:outline-none"
            type="number"
            placeholder="?"
            required
            >
        </div>

    </form>
</div>

<Button on:click="{completePuzzle}" label="Send" color="{displayError ? "red" : "green"}" />

<style>
    /* Remove arrows from number input */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
</style>