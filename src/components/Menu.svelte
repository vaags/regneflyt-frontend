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

    $: validationError = !quiz.operators.length
        || quiz.partOne.minValue > quiz.partOne.maxValue
        || quiz.partTwo.minValue > quiz.partTwo.maxValue;

    function startQuiz() {
        if (validationError) {
            return;
        }

        dispatch('startQuiz', { quiz });
    }
</script>

<form>
    <div class="card">
        <h2 class="mb-3 text-xl font-thin">Varighet</h2>
        <input class="w-3/4 md:w-1/2" type="range" min="1" max="30" step="1" bind:value={quiz.duration}>
        <div class="text-blue-800">{quiz.duration} {quiz.duration > 1 ? "minutter" : "minutt"}</div>
    </div>
    <div class="card">
        <h2 class="mb-3 text-xl font-thin">Regnearter</h2>
        {#each operatorMenu as operator}
            <label class="block">
                <input type="checkbox" bind:group={quiz.operators} value={operator.toLowerCase()}>
                    <span class="pl-1">{operator}</span>
            </label>
        {/each}
    </div>
    <div class="card">
        <h2 class="mb-3 text-xl font-thin">Tallvariasjon &ndash; første del</h2>
        <div>
            <label>Minste mulige tall<br />
                <input
                    class="w-3/4 md:w-1/2"
                    type="range" min="0"
                    max={quiz.partOne.maxValue}
                    step="1"
                    bind:value={quiz.partOne.minValue}>
            </label>
            <div class="text-blue-800 mb-4">{quiz.partOne.minValue}</div>
            <label>Største mulige tall<br />
                <input
                    class="w-3/4 md:w-1/2"
                    type="range"
                    min={quiz.partOne.minValue}
                    max="100"
                    step="1"
                    bind:value={quiz.partOne.maxValue}>
            </label>
            <div class="text-blue-800">{quiz.partOne.maxValue}</div>
        </div>
    </div>
    <div class="card">
        <h2 class="mb-3 text-xl font-thin">Tallvariasjon &ndash; andre del</h2>
        <div>
            <label>Minste mulige tall<br />
                <input
                    class="w-3/4 md:w-1/2"
                    type="range" min="0"
                    max={quiz.partTwo.maxValue}
                    step="1"
                    bind:value={quiz.partTwo.minValue}>
            </label>
            <div class="text-blue-800 mb-4">{quiz.partTwo.minValue}</div>
            <label>Største mulige tall<br />
                <input
                    class="w-3/4 md:w-1/2"
                    type="range"
                    min={quiz.partTwo.minValue}
                    max="100"
                    step="1"
                    bind:value={quiz.partTwo.maxValue}>
            </label>
            <div class="text-blue-800">{quiz.partTwo.maxValue}</div>
        </div>
    </div>
    <div>
        <Button
            on:click={startQuiz}
            label="Start"
            color="{validationError ? 'red' : 'green'}" />
    </div>
</form>