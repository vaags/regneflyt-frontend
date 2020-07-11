<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Range from './widgets/Range.svelte';
    import Alert from './widgets/Alert.svelte';

	export let quiz
    
    const dispatch = createEventDispatcher();
    
    function startQuiz() {
        dispatch('startQuiz', { quiz });
    }
</script>

<form>
    <div class="card mt-3">
        <h2>Varighet</h2>
        <label class="text-blue-800">{quiz.duration} {quiz.duration > 1 ? "minutter" : "minutt"}<br />
            <input class="w-3/4 md:w-1/2 py-1" type="range" min="1" max="30" step="1" bind:value={quiz.duration}>
        </label>
    </div>
    <div class="card">
        <h2>Regnearter</h2>
        {#each quiz.operators as operator}
            <label class="block pb-1">
                <input type="radio" bind:group={quiz.selectedOperator} value={operator.toLowerCase()}>
                    <span class="pl-1">{operator}</span>
            </label>
        {/each}
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
                    <Range
                        min="1"
                        max="10"
                        bind:value={quiz.partOne.minValue}
                        on:change="{() => {quiz.partOne.maxValue = quiz.partOne.minValue}}"
                    />
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
                    <Range
                        min="1"
                        max="10"
                        bind:value={quiz.partTwo.minValue}
                        on:change="{() => {quiz.partTwo.maxValue = quiz.partTwo.minValue}}"
                    />
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
    </div>
    <Button
        on:click={startQuiz}
        label="Start"
        color="green" />
</form>