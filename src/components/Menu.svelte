<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();
    export let length;
    export let operators;
    let validationError = false;

    let operatorMenu = [
        'Addisjon',
        'Subtraksjon',
        'Multiplikasjon',
        'Divisjon'
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
    <div class="mb-4 border rounded px-4 pt-2 pb-3">
        <p class="mb-2 text-xl font-thin">Varighet</p>
        <input class="w-3/4 md:w-1/2 float-left mt-1" type="range" min="1" max="30" step="1" bind:value={length}>
        <span class="text-blue-700 ml-2">{length} min</span>
    </div>
    <div class="mb-4 border rounded px-4 pt-2 pb-3">
        <p class="mb-2 text-xl font-thin">Regnearter</p>
        {#each operatorMenu as operator}
            <label class="block">
                <input type="checkbox" bind:group={operators} value={operator.toLowerCase()}>
                    <span class="pl-1">{operator}</span>
            </label>
        {/each}
    </div>
    <div>
        <Button
            on:click={startQuiz}
            label="Start"
            color="{displayError ? 'red' : 'green'}"
            isBig="true" />
    </div>
</div>