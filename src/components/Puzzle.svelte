<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';

    const dispatch = createEventDispatcher();

    export let operator;
    export let minValue;
    export let maxValue;
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
        puzzle.partOne = getRandomNumber()
        puzzle.partTwo = getRandomNumber()
        puzzle.answer = undefined,
        puzzle.isCorrect = undefined,
        puzzle.duration = undefined,
        puzzle.operator = operator;
        puzzleNumber++;
        input.focus()
        startTime = Date.now();
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
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

<div class="border rounded px-4 pt-2 pb-3">
    <h2 class="mb-3 text-xl font-thin">Oppgave {puzzleNumber}</h2>
    <form class="mb-4">
        <p class="text-5xl mb-4">{puzzle.partOne} <Operator operator={operator} /> {puzzle.partTwo} = <span class="text-blue-600">?</span></p>
        <input
            bind:this={input}
            bind:value={puzzle.answer}
            class="text-3xl border {displayError ? 'border-red-600' : ''} rounded w-40 py-2 px-3 leading-tight focus:outline-none"
            type="number"
            required
            >
        <div class="mt-4">
            <Button on:click="{completePuzzle}" label="Send" isBig="true" color="{displayError ? "red" : "green"}" />
        </div>
    </form>
</div>