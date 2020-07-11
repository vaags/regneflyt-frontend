<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Range from './widgets/Range.svelte';
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
    <div class="card mt-3">
        <h2>Varighet</h2>
        <input class="w-3/4 md:w-1/2" type="range" min="1" max="30" step="1" bind:value={quiz.duration}>
        <div class="text-blue-800">{quiz.duration} {quiz.duration > 1 ? "minutter" : "minutt"}</div>
    </div>
    <div class="card">
        <h2>Regnearter</h2>
        {#each operatorMenu as operator}
            <label class="block">
                <input type="checkbox" bind:group={quiz.operators} value={operator.toLowerCase()}>
                    <span class="pl-1">{operator}</span>
            </label>
        {/each}
    </div>
    <div class="card">
        <h2>Intervall &ndash; første del</h2>
        <div>
            <label>Fra og med:<br />
                <Range
                    max={quiz.partOne.maxValue}
                    bind:value={quiz.partOne.minValue}
                />
            </label>
            <label>Til og med:<br />
                <Range
                    min={quiz.partOne.minValue}
                    bind:value={quiz.partOne.maxValue}
                />
            </label>
        </div>
    </div>
    <div class="card">
        <h2>Intervall &ndash; andre del</h2>
        <div>
            <label>Fra og med:<br />
                <Range
                    max={quiz.partTwo.maxValue}
                    bind:value={quiz.partTwo.minValue}
                />
            </label>
            <label>Til og med:<br />
                <Range
                    min={quiz.partTwo.minValue}
                    bind:value={quiz.partTwo.maxValue}
                />
            </label>
        </div>
    </div>
    <Button
        on:click={startQuiz}
        label="Start"
        color="{validationError ? 'red' : 'green'}" />
</form>