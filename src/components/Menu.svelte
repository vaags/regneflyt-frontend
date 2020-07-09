<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();
    export let length;
    export let showAlernateGreeting;
    export let operators;
    let validationError = false;

    let operatorMenu = [
        'Addition',
        'Subtraction',
        'Multiplication',
        'Division'
    ]

    function startQuiz() {
        if (!operators.length) {
            validationError = true;
            return;
        }

        validationError = false;
        dispatch('startQuiz', {
            length, operators
        });
    }

    $: displayError = !operators.length && validationError;

</script>


<div>
    <Alert message="{ showAlernateGreeting ? 'Ready for some more?' : 'Let’s do some arithmetic!' }" />
    <div class="my-8">
        <p class="mt-8">Length:</p>
        <input class="w-full" type="range" min="1" max="30" step="1" bind:value={length}>
        <span>{length} {length == 1 ? "minute" : "minutes"}</span>
    </div>
    <div class="my-8">
        <p>Operators:</p>
        {#each operatorMenu as operator}
            <label class="block">
                <input type=checkbox bind:group={operators} value={operator.toLowerCase()}>
                {operator}
            </label>
        {/each}
    </div>
    <div class="text-center">
        <Button
            on:click={startQuiz}
            label="Start"
            color="{displayError ? 'red' : 'green'}"
            isBig="true" />
    </div>
</div>