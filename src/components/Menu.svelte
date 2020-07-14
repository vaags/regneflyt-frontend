<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Range from './widgets/Range.svelte';
    import Alert from './widgets/Alert.svelte';

	export let quiz
    
    const dispatch = createEventDispatcher();
    
    function startQuiz() {
        if (validationError) return;

        if (quiz.selectedOperator == 'multiplikasjon') {
            quiz.partTwo.possibleValues = getArrayOfNumbers(quiz.partTwo.minValue, quiz.partTwo.maxValue);
            quiz.partOne.minValue = quiz.partOne.possibleValues[0];
            quiz.partOne.maxValue = quiz.partOne.possibleValues[quiz.partOne.possibleValues.length - 1];
        } else if (quiz.selectedOperator == 'divisjon') {
            quiz.partOne.possibleValues = getArrayOfNumbers(quiz.partOne.minValue, quiz.partOne.maxValue);
            quiz.partTwo.minValue = quiz.partTwo.possibleValues[0];
            quiz.partTwo.maxValue = quiz.partTwo.possibleValues[quiz.partTwo.possibleValues.length - 1];
        } else {
            quiz.partOne.possibleValues = getArrayOfNumbers(quiz.partOne.minValue, quiz.partOne.maxValue);
            quiz.partTwo.possibleValues = getArrayOfNumbers(quiz.partTwo.minValue, quiz.partTwo.maxValue);
        }

        dispatch('startQuiz', { quiz });
    }

    function getArrayOfNumbers(first, last) {
        return Array(last).fill(first).map((x, y) => x + y);
    }

    function setRequiredPartProperties() {
        if (quiz.selectedOperator == 'multiplikasjon') {
            quiz.partOne.randomize = true;
            quiz.partTwo.randomize = false;
            quiz.partOne.possibleValues = [];
            quiz.partTwo.possibleValues = [];
        } else if (quiz.selectedOperator == 'divisjon') {
            quiz.partOne.randomize = false;
            quiz.partTwo.randomize = true;
        } else {
            quiz.partOne.randomize = true;
            quiz.partTwo.randomize = true;
        }
    }

    $: validationError = (quiz.selectedOperator == 'multiplikasjon' && quiz.partOne.possibleValues.length == 0)
        || (quiz.selectedOperator == 'divisjon' && quiz.partTwo.possibleValues.length == 0);

</script>

<form>
    <div class="card mt-3">
        <h2>Varighet</h2>
        <label class="text-blue-800">
            {quiz.duration} {quiz.duration > 1 ? "minutter" : "minutt"}<br />
            <input
                class="w-3/4 py-1"
                type="range"
                min="1"
                max="30"
                step="1"
                bind:value={quiz.duration}>
        </label>
    </div>
    <div class="card">
        <h2>Regnearter</h2>
        {#each quiz.operators as operator}
            <label class="block py-1">
                <input
                    type="radio"
                    bind:group={quiz.selectedOperator}
                    value={operator.toLowerCase()}
                    on:change="{() => setRequiredPartProperties()}"
                >
                <span class="ml-1">{operator}</span>
            </label>
        {/each}
        {#if quiz.selectedOperator === 'subtraksjon' || quiz.selectedOperator === 'alle'}
            <label class="block mt-2">
                <input type="checkbox" bind:checked={quiz.allowNegativeAnswer}>
                <span class="ml-1">Tillat negative svar</span>
            </label>
        {/if}
    </div>
    <div class="card">
        <h2>
            {#if quiz.selectedOperator === 'multiplikasjon'}
                Multiplikand
            {:else if quiz.selectedOperator === 'divisjon'}
                Dividend <small>(intervall)</small>
            {:else}
                Første ledd <small>(intervall)</small>
            {/if}
        </h2>
        <div>
            {#if quiz.selectedOperator === 'multiplikasjon'}
                    {#each Array(10) as _, i}
                        <label class="block py-1">
                            <input type=checkbox bind:group={quiz.partOne.possibleValues} value={i + 1}>
                            <span class="ml-1">{i + 1}</span>
                        </label>
                    {/each}
            {:else}
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
            {/if}
        </div>
        {#if quiz.selectedOperator === 'divisjon'}
            <label class="block mt-2">
                <input type="checkbox" bind:checked={quiz.partOne.randomize}>
                <span class="ml-1">Tilfeldige verdier</span>
            </label>
        {/if}
    </div>
    <div class="card">
        <h2>
            {#if quiz.selectedOperator === 'multiplikasjon'}
                Multiplikator <small>(intervall)</small>
            {:else if quiz.selectedOperator === 'divisjon'}
                Divisor
            {:else}
                Andre ledd <small>(intervall)</small>
            {/if}
        </h2>
        <div>
            {#if quiz.selectedOperator === 'divisjon'}
                    {#each Array(10) as _, i}
                        <label class="block py-1">
                            <input type=checkbox bind:group={quiz.partTwo.possibleValues} value={i + 1}>
                            <span class="ml-1">{i + 1}</span>
                        </label>
                    {/each}
            {:else}
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
            {/if}
        </div>
        {#if quiz.selectedOperator === 'multiplikasjon'}
            <label class="block mt-2">
                <input type="checkbox" bind:checked={quiz.partTwo.randomize}>
                <span class="ml-1">Tilfeldige verdier</span>
            </label>
        {/if}
    </div>
    <Button
        on:click={startQuiz}
        label="Start"
        color="{ validationError ? "red" : "green"}" />
</form>