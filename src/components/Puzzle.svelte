<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';

    const dispatch = createEventDispatcher();

    export let operator;

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
        puzzle.partOne = getRandomNumber()
        puzzle.partTwo = getRandomNumber()
        puzzle.answer = undefined,
        puzzle.isCorrect = undefined,
        puzzle.duration = undefined,
        puzzle.operator = operator;
        input.focus()
        startTime = Date.now();
    }

    function getRandomNumber() {
        return Math.ceil(Math.random() * 20)
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
            case 'addition':
                return puzzle.partOne + puzzle.partTwo == puzzle.answer;
            case 'subtraction':
                return puzzle.partOne - puzzle.partTwo == puzzle.answer;
            case 'multiplication':
                return puzzle.partOne * puzzle.partTwo == puzzle.answer;
            case 'division':
                return puzzle.partOne / puzzle.partTwo == puzzle.answer;
        }
    }

    function puzzleIsValid() {
        if (!puzzle.answer) {
            validationError = true;
            input.focus()
            return;
        }

        validationError = false;

        return !validationError;
    }

    onMount(() => {
        generatePuzzle()
        console.log('operator is set to:', operator)
    })

</script>

<div class="text-center">
    <p class="text-5xl mb-4">{puzzle.partOne} <Operator operator={operator} /> {puzzle.partTwo} = <span class="text-blue-600">?</span></p>
    <form class="mb-4">
        <input
            bind:this={input}
            bind:value={puzzle.answer}
            class="text-5xl border {displayError ? 'border-red-600' : ''} rounded w-40 py-2 px-3 leading-tight focus:outline-none"
            type="number"
            required
            >
        <div class="mt-4">
            <Button on:click="{completePuzzle}" label="Next" isBig="true" color="{displayError ? "red" : "green"}" />
        </div>
    </form>
</div>