<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';

    const dispatch = createEventDispatcher();

    export let quiz

    let puzzleNumber = 0;

    let puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: quiz.activeOperator
    }

    let input;
    let validationError = false;
    let startTime;

    $: displayError = !puzzle.answer && validationError;

    function generatePuzzle() {
        puzzle.partOne = getRandomNumber(quiz.partOne.minValue, quiz.partOne.maxValue)
        puzzle.partTwo = getRandomNumber(quiz.partTwo.minValue, quiz.partTwo.maxValue)

        shouldAvoidNegativeAnswer() && swapPuzzlePartValues();

        puzzle.answer = undefined
        puzzle.isCorrect = undefined
        puzzle.duration = undefined
        puzzleNumber++
        input.focus()
        startTime = Date.now();
    }

    function shouldAvoidNegativeAnswer() {
        return ((puzzle.operator == 'subtraksjon' && quiz.avoidNegativeAnswer)
            || puzzle.operator == 'divisjon')
            && puzzle.partTwo > puzzle.partOne;
    }

    function swapPuzzlePartValues() {
        [puzzle.partOne, puzzle.partTwo] = [puzzle.partTwo, puzzle.partOne];
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function completePuzzle() {
        if (!puzzleIsValid()) {
            return;
        }

        puzzle.isCorrect = evaluateAnswer();
        puzzle.duration = (Date.now() - startTime) / 1000;

        dispatch('addPuzzle', { puzzle: {...puzzle} });
        generatePuzzle()
    }

    function evaluateAnswer() {
        switch (quiz.activeOperator) {
            case 'addisjon':
                return puzzle.partOne + puzzle.partTwo === puzzle.answer;
            case 'subtraksjon':
                return puzzle.partOne - puzzle.partTwo === puzzle.answer;
            case 'multiplikasjon':
                return puzzle.partOne * puzzle.partTwo === puzzle.answer;
            case 'divisjon':
                return puzzle.partOne / puzzle.partTwo === puzzle.answer;
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

<div class="card">
    <h2>Oppgave {puzzleNumber}</h2>
    <form>
        <div class="text-center my-12 text-4xl">{puzzle.partOne} <Operator operator={quiz.activeOperator} /> {puzzle.partTwo} = 
        <input
            bind:this={input}
            bind:value={puzzle.answer}
            class="border {displayError ? 'validation-error-border' : ''} rounded w-24 py-2 px-3 leading-tight focus:outline-none"
            type="number"
            placeholder="?"
            required
            >
        </div>
        <div class="text-center">
            <Button on:click="{completePuzzle}" label="Send" color="{displayError ? "red" : "green"}" />
        </div>
    </form>
</div>

<style>
    /* Remove arrows from number input */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
</style>