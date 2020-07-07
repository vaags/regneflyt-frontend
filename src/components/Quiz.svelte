<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    const dispatch = createEventDispatcher();

    export let length;
    export let isStarted;
    export let isCompleted;
    export let isAborted;

    function abortQuiz() {
        dispatch('abortQuiz');
    }
</script>

<div>
    Hello from Quiz compontent.

    <Button on:click={abortQuiz} label="Quit" />
</div>