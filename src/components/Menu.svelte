<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();
    export let length;
    export let showAlernateGreeting;

    function startQuiz() {
        dispatch('startQuiz', {
            length
        });
    }

</script>


<div>
    <Alert message="{ showAlernateGreeting ? 'Ready for some more?' : 'Let’s do some arithmetic!' }" />
    <p class="mt-8">How long can you go?</p>
    <div class="mb-8">
        <input class="w-full" type="range" min="1" max="30" step="1" bind:value={length}>
        <span>{length} {length == 1 ? "minute" : "minutes"}</span>
    </div>
    <div class="text-center">
        <Button on:click={startQuiz} label="Start" color="green" isBig="true" />
    </div>
</div>