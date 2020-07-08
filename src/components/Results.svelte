<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';

    const dispatch = createEventDispatcher();
    let selectedLength = 5;

    function resetQuiz() {
        dispatch('resetQuiz');
    }

</script>

<div>
    <h1>Here are your results</h1>

    <Button  on:click={resetQuiz} label="Start over" />
</div>