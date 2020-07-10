<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();
	export let quiz
    
    let validationError = false;

    let operatorMenu = [
        'Addisjon',
        'Subtraksjon',
        'Multiplikasjon',
        'Divisjon'
    ]

    $: validationError = !quiz.operators.length || quiz.minValue >= quiz.maxValue;

    function startQuiz() {
        if (validationError) {
            return;
        }

        dispatch('startQuiz', { quiz });
    }
</script>


<form>
    <div class="mb-4 border rounded px-4 pt-2 pb-3">
        <h2 class="mb-3 text-xl font-thin">Varighet</h2>
        <input class="w-3/4 md:w-1/2" type="range" min="1" max="30" step="1" bind:value={quiz.duration}>
        <div class="text-blue-800">{quiz.duration} {quiz.duration > 1 ? "minutter" : "minutt"}</div>
    </div>
    <div class="mb-4 border rounded px-4 pt-2 pb-3">
        <h2 class="mb-3 text-xl font-thin">Regnearter</h2>
        {#each operatorMenu as operator}
            <label class="block">
                <input type="checkbox" bind:group={quiz.operators} value={operator.toLowerCase()}>
                    <span class="pl-1">{operator}</span>
            </label>
        {/each}
    </div>
    <div class="mb-4 border rounded px-4 pt-2 pb-3">
        <h2 class="mb-3 text-xl font-thin">Tallvariasjon</h2>
        <div>
            <div>Minste mulige tall</div>
            <input class="w-3/4 md:w-1/2" type="range" min="0" max={quiz.maxValue - 1} step="1" bind:value={quiz.minValue}>
            <div class="text-blue-800">{quiz.minValue}</div>
            <div class="mt-2">Største mulige tall</div>
            <input class="w-3/4 md:w-1/2" type="range" min={quiz.minValue + 1} max="100" step="1" bind:value={quiz.maxValue}>
            <div class="text-blue-800">{quiz.maxValue}</div>
        </div>
    </div>
    <div>
        <Button
            on:click={startQuiz}
            label="Start"
            color="{validationError ? 'red' : 'green'}" />
    </div>
</form>