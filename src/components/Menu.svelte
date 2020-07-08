<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();
    export let length;

    function startQuiz() {
        dispatch('startQuiz', {
            length
        });
    }

</script>


<div>
    <Alert message="Let's do some arithmetic!" />
    <p class="mt-4">Length (in minutes):</p>
    <div>
        <input class="w-full" type="range" min="1" max="30" step="1" bind:value={length}>
        <span>{length}</span>
    </div>
    <Button on:click={startQuiz} label="Start" />
</div>