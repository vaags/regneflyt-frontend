<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import Puzzle from './Puzzle.svelte';
    import Button from './widgets/Button.svelte';

    export let length;
    export let operators;

    const dispatch = createEventDispatcher();
    const interval = setTimeout(completeQuiz, length * 60000);
    let showWarning = false;
    let puzzleSet = [];
    let activeOperator;

    onDestroy(() => {
        clearInterval(interval);
    });

    onMount(() => {
        setOperator();
    });

    function abortQuiz() {
        dispatch('abortQuiz');
    }

    function completeQuiz() {
        dispatch('completeQuiz', { puzzleSet });
    }

    function addPuzzle(event) {
        puzzleSet = [...puzzleSet, event.detail.puzzle];
        console.log('added puzzle:', event.detail.puzzle);
        setOperator();
    }

    function setOperator() {
        if (operators.length) {
            var random = Math.ceil(Math.random() * operators.length)
    
            activeOperator = operators[random - 1];
        } else {
            activeOperator = operators[0]
        }

        console.log('active operator:', activeOperator)
    }

    function toggleWarning() {
        showWarning = !showWarning;
    }
</script>

<div>
    {#if activeOperator}
        <Puzzle
            operator={activeOperator}
            on:addPuzzle={addPuzzle} />
    {/if}

    <div class="mt-8">
        <Button on:click={completeQuiz} label="Fullfør" />
        {#if showWarning}
            <p class="mb-2">Er du sikker på at du vil avbryte?</p>
            <Button on:click={abortQuiz} label="ja" color="red" />
            <Button on:click={toggleWarning} label="Nei" />
        {:else}
            <Button on:click={toggleWarning} label="Avbryt" color="gray" />
        {/if}
    </div>
</div>