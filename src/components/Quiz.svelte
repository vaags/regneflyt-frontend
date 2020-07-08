<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import Button from './widgets/Button.svelte';

    export let length;

    const dispatch = createEventDispatcher();
    const interval = setTimeout(completeQuiz, length * 60000);
    let showWarning = false;

    onDestroy(() => {
        console.log('clearing interval');
        clearInterval(interval);
    });

    function abortQuiz() {
        console.log('aborting');
        dispatch('abortQuiz');
    }

    function completeQuiz() {
        console.log('completing');
        dispatch('completeQuiz');
    }

    function toggleWarning() {
        showWarning = !showWarning;
    }
</script>

<div>
    Hello from Quiz compontent.

    <div class="mt-2">
        {#if showWarning}
            <p class="mb-2">Are you sure you want to quit?</p>
            <Button on:click={abortQuiz} label="Yes" />
            <Button on:click={toggleWarning} label="No" />
        {:else}
            <Button on:click={toggleWarning} label="Quit" />
        {/if}
    </div>
</div>