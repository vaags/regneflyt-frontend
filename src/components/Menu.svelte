<script>
    import { createEventDispatcher } from 'svelte'
    import Button from './widgets/Button.svelte'
    import Range from './widgets/Range.svelte'
    import Alert from './widgets/Alert.svelte'

    export let quiz

    const dispatch = createEventDispatcher()

    $: isDivision = quiz.selectedOperator === 'divisjon'
    $: isMultiplication = quiz.selectedOperator === 'multiplikasjon'

    $: validationError =
        (isMultiplication && quiz.partOne.possibleValues.length == 0) ||
        (isDivision && quiz.partTwo.possibleValues.length == 0)

    function startQuiz() {
        if (validationError) return

        if (isMultiplication) {
            quiz.partTwo.possibleValues = getArrayOfNumbers(
                quiz.partTwo.minValue,
                quiz.partTwo.maxValue
            )
            quiz.partOne.minValue = quiz.partOne.possibleValues[0]
            quiz.partOne.maxValue =
                quiz.partOne.possibleValues[
                    quiz.partOne.possibleValues.length - 1
                ]
        } else if (isDivision) {
            quiz.partOne.possibleValues = getArrayOfNumbers(
                quiz.partOne.minValue,
                quiz.partOne.maxValue
            )
            quiz.partTwo.minValue = quiz.partTwo.possibleValues[0]
            quiz.partTwo.maxValue =
                quiz.partTwo.possibleValues[
                    quiz.partTwo.possibleValues.length - 1
                ]
        } else {
            quiz.partOne.possibleValues = getArrayOfNumbers(
                quiz.partOne.minValue,
                quiz.partOne.maxValue
            )
            quiz.partTwo.possibleValues = getArrayOfNumbers(
                quiz.partTwo.minValue,
                quiz.partTwo.maxValue
            )
        }

        dispatch('startQuiz', { quiz })
    }

    function getArrayOfNumbers(first, last) {
        return Array(last)
            .fill(first)
            .map((x, y) => x + y)
    }

    function setRequiredPartProperties() {
        if (isMultiplication) {
            quiz.partOne.randomize = true
            quiz.partTwo.randomize = false
            quiz.partOne.possibleValues = []
            quiz.partTwo.possibleValues = []
        } else if (isDivision) {
            quiz.partOne.randomize = false
            quiz.partTwo.randomize = true
        } else {
            quiz.partOne.randomize = true
            quiz.partTwo.randomize = true
        }
    }

    $: {
        // Set querystring params to allow for easy sharing of settings through url
        let parameters = {
            duration: quiz.duration,
            timeLimit: quiz.puzzleTimeLimit,
            operator: quiz.selectedOperator,
            negatives: quiz.allowNegativeAnswer,
            partOneMin: quiz.partOne.minValue,
            partOneMax: quiz.partOne.maxValue,
            partOneValues: isMultiplication
                ? quiz.partOne.possibleValues
                : null,
            partOneRandom: quiz.partOne.randomize,
            partTwoMin: quiz.partTwo.minValue,
            partTwoMax: quiz.partTwo.maxValue,
            partTwoValues: isDivision ? quiz.partTwo.possibleValues : null,
            partTwoRandom: quiz.partTwo.randomize,
        }

        window.history.replaceState(
            null,
            null,
            `?${new URLSearchParams(parameters).toString()}`
        )
    }
</script>

<form>
    <div class="card mt-3">
        <h2>Spilletid</h2>
        <label>
            Totalt: (i minutter)
            <br />
            <Range min="1" max="30" bind:value="{quiz.duration}" />
        </label>

        <label>
            Per oppgave: (i sekunder)
            <br />
            <Range
                zeroLabel="Ingen"
                max="10"
                bind:value="{quiz.puzzleTimeLimit}" />
        </label>
    </div>
    <div class="card">
        <h2>Regnearter</h2>
        {#each quiz.operators as operator}
            <label class="block py-1">
                <input
                    type="radio"
                    bind:group="{quiz.selectedOperator}"
                    value="{operator.toLowerCase()}"
                    on:change="{setRequiredPartProperties}" />
                <span class="ml-1">{operator}</span>
            </label>
        {/each}
        {#if quiz.selectedOperator === 'subtraksjon' || quiz.selectedOperator === 'alle'}
            <label class="block mt-2">
                <input
                    type="checkbox"
                    bind:checked="{quiz.allowNegativeAnswer}" />
                <span class="ml-1">Tillat negative svar</span>
            </label>
        {/if}
    </div>
    <div class="card">
        <h2>
            {#if isMultiplication}
                Multiplikand
            {:else if quiz.selectedOperator === 'divisjon'}
                Dividend
                <small>(intervall)</small>
            {:else}
                Første ledd
                <small>(intervall)</small>
            {/if}
        </h2>
        <div>
            {#if isMultiplication}
                {#each Array(10) as _, i}
                    <label class="block py-1">
                        <input
                            type="checkbox"
                            bind:group="{quiz.partOne.possibleValues}"
                            value="{i + 1}" />
                        <span class="ml-1">{i + 1}</span>
                    </label>
                {/each}
            {:else}
                <label>
                    Fra og med:
                    <br />
                    <Range
                        max="{quiz.partOne.maxValue}"
                        bind:value="{quiz.partOne.minValue}" />
                </label>
                <label>
                    Til og med:
                    <br />
                    <Range
                        min="{quiz.partOne.minValue}"
                        bind:value="{quiz.partOne.maxValue}" />
                </label>
            {/if}
        </div>
        {#if isDivision}
            <label class="block mt-2">
                <input
                    type="checkbox"
                    bind:checked="{quiz.partOne.randomize}" />
                <span class="ml-1">Tilfeldige verdier</span>
            </label>
        {/if}
    </div>
    <div class="card">
        <h2>
            {#if isMultiplication}
                Multiplikator
                <small>(intervall)</small>
            {:else if isDivision}
                Divisor
            {:else}
                Andre ledd
                <small>(intervall)</small>
            {/if}
        </h2>
        <div>
            {#if isDivision}
                {#each Array(10) as _, i}
                    <label class="block py-1">
                        <input
                            type="checkbox"
                            bind:group="{quiz.partTwo.possibleValues}"
                            value="{i + 1}" />
                        <span class="ml-1">{i + 1}</span>
                    </label>
                {/each}
            {:else}
                <label>
                    Fra og med:
                    <br />
                    <Range
                        max="{quiz.partTwo.maxValue}"
                        bind:value="{quiz.partTwo.minValue}" />
                </label>
                <label>
                    Til og med:
                    <br />
                    <Range
                        min="{quiz.partTwo.minValue}"
                        bind:value="{quiz.partTwo.maxValue}" />
                </label>
            {/if}
        </div>
        {#if isMultiplication}
            <label class="block mt-2">
                <input
                    type="checkbox"
                    bind:checked="{quiz.partTwo.randomize}" />
                <span class="ml-1">Tilfeldige verdier</span>
            </label>
        {/if}
    </div>
    <Button
        on:click="{startQuiz}"
        label="Start"
        color="{validationError ? 'red' : 'green'}" />
</form>
