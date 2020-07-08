<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Button from './widgets/Button.svelte';

    const dispatch = createEventDispatcher();

    let puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        isCorrect: undefined
    }

    let input;
    let validationError = false;

    $: displayError = !puzzle.answer && validationError;

    function generatePuzzle() {
        puzzle.partOne = getRandomNumber()
        puzzle.partTwo = getRandomNumber()
        puzzle.answer = undefined,
        puzzle.isCorrect = undefined
        input.focus()
    }

    function getRandomNumber() {
        return Math.ceil(Math.random() * 20)
    }

    function completePuzzle() {
        if (!puzzleIsValid()) {
            return;
        }

        puzzle.isCorrect = puzzle.partOne + puzzle.partTwo == puzzle.answer;

        dispatch('addPuzzle', { puzzle });
        generatePuzzle()
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
    })

</script>

<div class="text-center">
    <p class="text-5xl mb-4">{puzzle.partOne} + {puzzle.partTwo} = <span class="text-blue-600">{puzzle.answer || "?"}</span></p>
    <form class="mb-4">
        <input
            bind:this={input}
            bind:value={puzzle.answer}
            class="text-xl border {displayError ? 'border-red-600' : ''} rounded w-50 py-2 px-3 leading-tight focus:outline-none"
            type="number"
            required
            max="9999"
            >
        <div class="mt-4">
            <Button on:click="{completePuzzle}" label="Next" isBig="true" color="{displayError ? "red" : "green"}" />
        </div>
    </form>
</div>