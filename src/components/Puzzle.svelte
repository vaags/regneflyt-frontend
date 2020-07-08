<script>
    import { onMount } from 'svelte';
    import Button from './widgets/Button.svelte';

    let partOne;
    let partTwo;
    let answer;

    let input;

    function generatePuzzle() {
        partOne = getRandomNumber()
        partTwo = getRandomNumber()
        answer = undefined
        input.focus()
    }

    function getRandomNumber() {
        return Math.ceil(Math.random() * 20)
    }

    onMount(() => {
        generatePuzzle()
    })

</script>

<div class="text-center">
    <p class="text-5xl mb-4">{partOne} + {partTwo} = <span class="text-blue-600">{answer || "?"}</span></p>
    <form class="mb-4">
        <input
            bind:this={input}
            bind:value={answer}
            class="text-xl border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            type="number"
            required
            max="9999"
            >
    </form>
    <Button on:click="{generatePuzzle}" label="Next" isBig="true" />
</div>