<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import Puzzle from './Puzzle.svelte';
    import Button from './widgets/Button.svelte';

    export let length;

    const dispatch = createEventDispatcher();
    const interval = setTimeout(completeQuiz, length * 60000);
    let showWarning = false;
    let puzzleSet = [];

    onDestroy(() => {
        clearInterval(interval);
    });

    function abortQuiz() {
        dispatch('abortQuiz');
    }

    function completeQuiz() {
        console.log('completing');
        dispatch('completeQuiz', { puzzleSet });
    }

    function addPuzzle(event) {
        puzzleSet = [...puzzleSet, event.detail.puzzle];
        console.log('added puzzle to puzzleSet', puzzleSet);
    }

    function toggleWarning() {
        showWarning = !showWarning;
    }
</script>

<div>
    <Puzzle on:addPuzzle={addPuzzle} />

    <div class="mt-8">
        <Button on:click={completeQuiz} label="Complete" />
        {#if showWarning}
            <p class="mb-2">Are you sure you want to quit?</p>
            <Button on:click={abortQuiz} label="Yes" color="red" />
            <Button on:click={toggleWarning} label="No" />
        {:else}
            <Button on:click={toggleWarning} label="Quit" color="gray" />
        {/if}
    </div>
</div>