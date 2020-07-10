<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import Puzzle from './Puzzle.svelte';
    import Button from './widgets/Button.svelte';

    export let quiz;

    const dispatch = createEventDispatcher();
    const interval = setTimeout(completeQuiz, quiz.duration * 60000);
    let showWarning = false;
    let puzzleSet = [];
    let activeOperator;
    const isLocalhost = location.hostname === "localhost";

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
        if (quiz.operators.length > 1) {
            var random = Math.ceil(Math.random() * quiz.operators.length)
    
            activeOperator = quiz.operators[random - 1];
            console.log('active operator:', activeOperator)
        } else {
            activeOperator = quiz.operators[0]
        }

    }

    function toggleWarning() {
        showWarning = !showWarning;
    }
</script>

<div>
    {#if activeOperator}
        <Puzzle
            operator={activeOperator}
            partOne={quiz.partOne}
            partTwo={quiz.partTwo}
            on:addPuzzle={addPuzzle} />
    {/if}

    <div class="text-right">
        {#if showWarning}
            <p class="mb-2">Er du sikker på at du vil avbryte?</p>
            <Button on:click={abortQuiz} label="ja" color="red" />
            <Button on:click={toggleWarning} label="Nei" />
        {:else}
            {#if isLocalhost}
                <Button on:click={completeQuiz} label="Fullfør" />
            {/if}
            <Button on:click={toggleWarning} label="Avbryt" color="gray" />
        {/if}
    </div>
</div>