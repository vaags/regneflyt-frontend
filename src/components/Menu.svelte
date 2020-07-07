<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    const dispatch = createEventDispatcher();
    let selectedLength = 5;

    function startQuiz() {
        dispatch('startQuiz', {
            length: selectedLength
        });
    }

</script>


<div>
    <input class="w-full" type="range" min="1" max="60" step="1" bind:value={selectedLength}>
    <p>{selectedLength}</p>
    <Button on:click={startQuiz} label="Start new game" />
</div>