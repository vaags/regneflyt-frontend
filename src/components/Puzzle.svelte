<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';

    const dispatch = createEventDispatcher();

    export let partOne;
    export let partTwo;
    export let operator;

    let puzzleNumber = 0;

    let puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: undefined
    }

    let input;
    let validationError = false;
    let startTime;

    $: displayError = !puzzle.answer && validationError;

    function generatePuzzle() {
        puzzle.partOne = getRandomNumber(partOne.minValue, partOne.maxValue)
        puzzle.partTwo = getRandomNumber(partTwo.minValue, partTwo.maxValue)
        puzzle.answer = undefined
        puzzle.isCorrect = undefined
        puzzle.duration = undefined
        puzzle.operator = operator
        puzzleNumber++
        input.focus()
        startTime = Date.now();
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
        switch (operator) {
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
        <div class="text-center my-12 text-4xl">{puzzle.partOne} <Operator operator={operator} /> {puzzle.partTwo} = 
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