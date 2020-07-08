<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';

    const dispatch = createEventDispatcher();
    export let length;

    function startQuiz() {
        dispatch('startQuiz', {
            length
        });
    }

</script>


<div>
    <p>Select game length:</p>
    <div>
        <input class="w-full" type="range" min="1" max="30" step="1" bind:value={length}>
        <span>{length}</span>
    </div>
    <Button on:click={startQuiz} label="Start" />
</div>